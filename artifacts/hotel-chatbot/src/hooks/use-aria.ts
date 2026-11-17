import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-url";
import { getSessionId } from "@/lib/session";
import { useAuthContext } from "@/contexts/auth-context";

export interface AriaContext {
  preferences: string[];
  interests: string[];
  language: string;
  dietaryNeeds: string | null;
  travelParty: string | null;
  stayDates: string | null;
}

export interface AriaAction {
  id: number;
  type: string;
  title: string;
  details: string;
  preferredTime: string | null;
  status: "requested" | "confirmed" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

function useAriaScope() {
  const { user } = useAuthContext();
  return user?.id ?? getSessionId();
}

function sessionHeaders() {
  return { "x-session-id": getSessionId() };
}

export function useAriaContext(conversationId?: number) {
  const scope = useAriaScope();
  return useQuery<AriaContext>({
    queryKey: ["aria-context", scope, conversationId],
    queryFn: async () => {
      const res = await apiFetch("/api/aria/context", { headers: sessionHeaders() });
      if (!res.ok) throw new Error("Failed to fetch Aria preferences");
      return res.json();
    },
  });
}

export function useUpdateAriaContext() {
  const queryClient = useQueryClient();
  const scope = useAriaScope();
  return useMutation({
    mutationFn: async ({ data }: { conversationId?: number; data: Partial<AriaContext> }) => {
      const res = await apiFetch("/api/aria/context", {
        method: "PUT",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update Aria preferences");
      return res.json() as Promise<AriaContext>;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["aria-context", scope, variables.conversationId], data);
    },
  });
}

export function useAriaActions(conversationId?: number) {
  const scope = useAriaScope();
  return useQuery<AriaAction[]>({
    queryKey: ["aria-actions", scope, conversationId],
    queryFn: async () => {
      const res = await apiFetch("/api/aria/actions", { headers: sessionHeaders() });
      if (!res.ok) throw new Error("Failed to fetch concierge requests");
      return res.json();
    },
  });
}

export interface NewAriaAction {
  type: string;
  title: string;
  details: string;
  preferredTime?: string | null;
}

export function useCreateAriaAction() {
  const queryClient = useQueryClient();
  const scope = useAriaScope();
  return useMutation({
    mutationFn: async (data: NewAriaAction) => {
      const res = await apiFetch("/api/aria/actions", {
        method: "POST",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send concierge request");
      return res.json() as Promise<AriaAction>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aria-actions", scope] });
    },
  });
}

export function useCancelAriaAction() {
  const queryClient = useQueryClient();
  const scope = useAriaScope();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiFetch(`/api/aria/actions/${id}`, {
        method: "PATCH",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error("This request can no longer be cancelled");
      return res.json() as Promise<AriaAction>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aria-actions", scope] });
    },
  });
}

export function useAriaRecommendations() {
  return useMutation({
    mutationFn: async ({
      request,
      preferences,
    }: {
      conversationId?: number;
      request: string;
      preferences?: string[];
    }) => {
      const res = await apiFetch("/api/aria/recommendations", {
        method: "POST",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ request, preferences }),
      });
      if (!res.ok) throw new Error("Failed to generate recommendations");
      return res.json();
    },
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error("Could not read image"));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export function useAriaVision() {
  return useMutation({
    mutationFn: async ({ file, prompt }: { file: File; conversationId?: number; prompt?: string }) => {
      const imageDataUrl = await readFileAsDataUrl(file);
      const res = await apiFetch("/api/aria/vision", {
        method: "POST",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl, prompt }),
      });
      if (!res.ok) throw new Error("Failed to analyze image");
      return res.json() as Promise<{ summary: string; text: string; suggestions: string[] }>;
    },
  });
}

export function useAriaTranscribe() {
  return useMutation({
    mutationFn: async ({ audioBlob, conversationId }: { audioBlob: Blob; conversationId?: number }) => {
      const audioBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const value = typeof reader.result === "string" ? reader.result : "";
          resolve(value.includes(",") ? value.split(",")[1] : value);
        };
        reader.onerror = () => reject(reader.error ?? new Error("Could not read audio"));
        reader.readAsDataURL(audioBlob);
      });
      const res = await apiFetch("/api/aria/transcribe", {
        method: "POST",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64, language: "auto" }),
      });
      if (!res.ok) throw new Error("Failed to transcribe audio");
      return res.json() as Promise<{ text: string; transcript: string; language: string }>;
    },
  });
}

export function useAriaSpeak() {
  return useMutation({
    mutationFn: async ({ text, language }: { text: string; language?: string }) => {
      const res = await apiFetch("/api/aria/speak", {
        method: "POST",
        headers: { ...sessionHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(typeof result?.error === "string" ? result.error : "Could not create Aria's audio response");
      }
      return res.blob();
    },
  });
}
