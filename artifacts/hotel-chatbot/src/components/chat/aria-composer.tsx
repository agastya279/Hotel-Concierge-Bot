import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Square, Image as ImageIcon, Mic, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAriaTranscribe, useAriaVision } from "@/hooks/use-aria";
import { useToast } from "@/hooks/use-toast";

interface AriaComposerProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  isStreaming: boolean;
  stopStreaming: () => void;
  conversationId?: number;
  disabled?: boolean;
}

export function AriaComposer({
  input,
  setInput,
  handleSend,
  isStreaming,
  stopStreaming,
  conversationId,
  disabled
}: AriaComposerProps) {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const transcribeMutation = useAriaTranscribe();
  const visionMutation = useAriaVision();

  const resizeTextarea = () => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${Math.min(t.scrollHeight, 192)}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        toast({ title: "Voice recording is not supported in this browser", variant: "destructive" });
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
        .find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
      const mediaRecorder = new MediaRecorder(stream, preferredMimeType ? { mimeType: preferredMimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        
        try {
          const res = await transcribeMutation.mutateAsync({ audioBlob, conversationId });
          if (res.text) {
            setInput(input ? `${input} ${res.text}` : res.text);
            toast({ title: "Audio transcribed" });
          }
        } catch (err) {
          toast({ title: "Failed to transcribe audio", variant: "destructive" });
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Choose a JPG, PNG, or WebP image", variant: "destructive" });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be under 5 MB", variant: "destructive" });
      e.target.value = "";
      return;
    }
    try {
      const res = await visionMutation.mutateAsync({
        file,
        conversationId,
        prompt: "Describe the image briefly and explain anything relevant to a SEED Resort guest. Do not claim resort availability or identify private people.",
      });
      if (res.summary) {
        const analysis = `Image analysis: ${res.summary}`;
        setInput((current) => current.trim() ? `${current.trim()}\n\n${analysis}` : analysis);
        toast({ title: "Image analyzed", description: "Review the summary, then send it to Aria." });
      }
    } catch {
      toast({ title: "Failed to analyze image", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const charCount = input.length;
  const showCharCount = charCount > 150;
  const isLoading = transcribeMutation.isPending || visionMutation.isPending;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/98 to-transparent pt-8 pb-5 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white rounded-2xl p-1.5 flex flex-col shadow-md border border-border focus-within:border-primary/30 focus-within:shadow-lg transition-all duration-200">
          
          {/* Top Actions (Attach, Voice) */}
          <div className="flex items-center justify-between px-2 pt-1 pb-0 border-b border-transparent">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || disabled || isStreaming}
                className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
                title="Upload image"
              >
                {visionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              </button>
              
              <button
                type="button"
                onClick={handleMicClick}
                disabled={visionMutation.isPending || disabled || isStreaming}
                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                  isRecording 
                    ? "text-destructive bg-destructive/10 hover:bg-destructive/20" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
                title="Voice input"
              >
                {transcribeMutation.isPending && !isRecording ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
                    {isRecording && <span className="text-xs font-medium animate-pulse tracking-wide">Recording...</span>}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-end px-1 pb-1 pt-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Message Aria..."
              className="w-full max-h-48 min-h-[44px] bg-transparent border-none resize-none focus:outline-none focus:ring-0 px-3 py-2 text-foreground placeholder:text-muted-foreground/50 text-[15px] leading-relaxed"
              rows={1}
              disabled={isStreaming || disabled || isLoading}
            />
            
            <AnimatePresence>
              {showCharCount && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute bottom-[18px] right-[52px] text-[10px] tabular-nums pointer-events-none transition-colors ${
                    charCount > 1800 ? "text-red-400/70" : "text-muted-foreground/40"
                  }`}
                >
                  {charCount}
                </motion.span>
              )}
            </AnimatePresence>
            
            {isStreaming ? (
              <motion.button
                key="stop"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={stopStreaming}
                className="shrink-0 mb-1 ml-2 h-9 w-9 rounded-xl bg-muted hover:bg-destructive/10 border border-border hover:border-destructive/30 flex items-center justify-center transition-all"
              >
                <Square className="w-3.5 h-3.5 text-muted-foreground fill-muted-foreground" />
              </motion.button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!input.trim() || disabled || isLoading}
                className="shrink-0 mb-1 ml-2 h-9 w-9 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        </div>
        <p className="text-center mt-2.5 text-[10px] text-muted-foreground/40 tracking-widest uppercase font-medium">
          SEED Resort Concierge
        </p>
      </div>
    </div>
  );
}
