import { useState, useCallback, useRef } from "react";

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export function useGuestStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    history: HistoryMessage[],
  ): Promise<string> => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsStreaming(true);
    setStreamedContent("");

    let fullResponse = "";

    try {
      const response = await fetch("/api/openai/guest-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, history }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (!dataStr || dataStr === "[DONE]") continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                fullResponse += data.content;
                setStreamedContent(fullResponse);
              }
            } catch {}
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        // User stopped — return whatever we have so far
      } else {
        console.error("Guest streaming error:", error);
      }
    } finally {
      setTimeout(() => {
        setIsStreaming(false);
        setStreamedContent("");
      }, 150);
    }

    return fullResponse;
  }, []);

  return { sendMessage, stopStreaming, isStreaming, streamedContent };
}
