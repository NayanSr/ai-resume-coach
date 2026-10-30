"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  resumeId: string;
  initialSessionId?: string | null;
};

export function CoachChat({ resumeId, initialSessionId }: Props) {
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId ?? null
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          resumeId,
          sessionId: sessionId ?? undefined,
        },
        // Capture session id from response header on first message
        fetch: async (url, init) => {
          const res = await fetch(url, init);
          const sid = res.headers.get("X-Chat-Session-Id");
          if (sid) setSessionId(sid);
          return res;
        },
      }),
    [resumeId, sessionId]
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `resume-${resumeId}`,
    transport,
  });

  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <Card className="flex min-h-[28rem] flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Chat coach</CardTitle>
        <p className="text-xs text-muted-foreground">
          Resume context auto-attached. Ask for stronger bullets, ATS tips, or
          interview prep.
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex-1 space-y-3 overflow-y-auto rounded-md border bg-muted/20 p-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Example: “Rewrite my latest role with more metrics” or “What
              keywords am I missing for a frontend role?”
            </p>
          )}
          {messages.map((m) => {
            const text = m.parts
              ?.filter((p) => p.type === "text")
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-background border"
                )}
              >
                {text}
              </div>
            );
          })}
          {busy && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach…"
            rows={2}
            disabled={busy}
            className="min-h-[2.5rem] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void onSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={busy || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}