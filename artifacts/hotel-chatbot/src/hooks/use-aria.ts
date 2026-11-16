import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-url";

export interface AriaContext {
  preferences: string[];
  language: string;
}

export interface AriaAction {
  id: string;
  type: string;
  status: "pending" | "confirmed" | "failed";
  payload: any;
  createdAt: string;
}

export function useAriaContext(conversationId?: number) {
  return useQuery<AriaContext>({
    queryKey: ["aria-context", conversationId],
    queryFn: async () => {
      const res = await apiFetch(`/api/aria/context${conversationId ? `?conversationId=${conversationId}` : ''}`);
      if (!res.ok) throw new Error("Failed to fetch context");
      return res.json();
    }
  });
}

export function useUpdateAriaContext() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, data }: { conversationId?: number; data: Partial<AriaContext> }) => {
      const res = await apiFetch(`/api/aria/context${conversationId ? `?conversationId=${conversationId}` : ''}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update context");
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["aria-context", variables.conversationId], (old: any) => ({ ...old, ...data }));
    }
  });
}

export function useAriaActions(conversationId?: number) {
  return useQuery<AriaAction[]>({
    queryKey: ["aria-actions", conversationId],
    queryFn: async () => {
      const res = await apiFetch(`/api/aria/actions${conversationId ? `?conversationId=${conversationId}` : ''}`);
      if (!res.ok) throw new Error("Failed to fetch actions");
      return res.json();
    }
  });
}

export function useCreateAriaAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, actionType, payload }: { conversationId?: number; actionType: string; payload: any }) => {
      const res = await apiFetch(`/api/aria/actions${conversationId ? `?conversationId=${conversationId}` : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType, payload }),
      });
      if (!res.ok) throw new Error("Failed to create action");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["aria-actions", variables.conversationId] });
    }
  });
}

export function useAriaRecommendations() {
  return useMutation({
    mutationFn: async ({ conversationId, query, preferences }: { conversationId?: number; query?: string; preferences?: string[] }) => {
      const res = await apiFetch(`/api/aria/recommendations${conversationId ? `?conversationId=${conversationId}` : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, preferences }),
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    }
  });
}

export function useAriaVision() {
  return useMutation({
    mutationFn: async ({ base64Image, conversationId }: { base64Image: string, conversationId?: number }) => {
      const res = await apiFetch(`/api/aria/vision${conversationId ? `?conversationId=${conversationId}` : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      if (!res.ok) throw new Error("Failed to process image");
      return res.json();
    }
  });
}

export function useAriaTranscribe() {
  return useMutation({
    mutationFn: async ({ audioBlob, conversationId }: { audioBlob: Blob, conversationId?: number }) => {
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const value = typeof reader.result === "string" ? reader.result : "";
          resolve(value.includes(",") ? value.split(",")[1] : value);
        };
        reader.onerror = () => reject(reader.error ?? new Error("Could not read audio"));
        reader.readAsDataURL(audioBlob);
      });
      const res = await apiFetch(`/api/aria/transcribe${conversationId ? `?conversationId=${conversationId}` : ''}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64 }),
      });
      if (!res.ok) throw new Error("Failed to transcribe audio");
      return res.json();
    }
  });
}
