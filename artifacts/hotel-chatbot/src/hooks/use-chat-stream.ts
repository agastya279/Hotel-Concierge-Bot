import { useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOpenaiMessagesQueryKey } from "@workspace/api-client-react";
import { apiFetch } from "@/lib/api-url";

export function useChatStream(conversationId: number | undefined) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const queryClient = useQueryClient();

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setOptimisticUserMessage(content);
    setIsStreaming(true);
    setStreamedContent("");

    try {
      const response = await apiFetch(`/api/openai/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentText = "";
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
                currentText += data.content;
                setStreamedContent(currentText);
              }
            } catch {
              // ignore partial JSON
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        // User stopped generation — keep streamed content visible in bubble
      } else {
        console.error("Streaming error:", error);
      }
    } finally {
      await queryClient.invalidateQueries({
        queryKey: getListOpenaiMessagesQueryKey(conversationId),
      });
      setTimeout(() => {
        setOptimisticUserMessage(null);
        setStreamedContent("");
        setIsStreaming(false);
      }, 150);
    }
  }, [conversationId, queryClient]);

  return { sendMessage, stopStreaming, isStreaming, streamedContent, optimisticUserMessage };
}
