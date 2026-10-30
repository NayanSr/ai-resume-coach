import { getTextFromUIMessage } from "@/src/lib/ai/message-utils";
import { getChatModel } from "@/src/lib/ai/model";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
// import { getChatModel } from "@/lib/ai/model";
// import { getTextFromUIMessage } from "@/lib/ai/message-utils";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  resumeId?: string;
  sessionId?: string;
};

export async function POST(req: Request) {
  try {
    const user = await requireDbUser();
    const body = (await req.json()) as Body;
    const { messages, resumeId, sessionId } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    // Load resume context (optional but recommended)
    let resumeText = "";
    let resumeTitle = "";
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId: user.id },
        select: { id: true, title: true, rawText: true },
      });
      if (!resume) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }
      resumeTitle = resume.title;
      resumeText = (resume.rawText ?? "").slice(0, 12_000);
    }

    // Ensure chat session
    let chatSessionId = sessionId;
    if (chatSessionId) {
      const existing = await prisma.chatSession.findFirst({
        where: { id: chatSessionId, userId: user.id },
      });
      if (!existing) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
    } else {
      const created = await prisma.chatSession.create({
        data: {
          userId: user.id,
          resumeId: resumeId || null,
          title: resumeTitle
            ? `Coach · ${resumeTitle}`.slice(0, 80)
            : "Resume coach",
        },
      });
      chatSessionId = created.id;
    }

    // Persist the latest user message before streaming
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      const content = getTextFromUIMessage(lastUser);
      if (content) {
        await prisma.message.create({
          data: {
            chatSessionId,
            role: "USER",
            content,
          },
        });
      }
    }

    const system = `You are an expert resume and career coach.
Be concise, practical, and specific.
Help improve bullet points, quantify impact, tailor to jobs, and prepare for interviews.
If resume context is provided, ground advice in that text — do not invent experience.

${
  resumeText
    ? `RESUME TITLE: ${resumeTitle}

RESUME TEXT:
---
${resumeText}
---`
    : "No resume is attached. Ask the user to open a resume chat from a resume page if needed."
}`;

    const result = streamText({
      model: getChatModel(),
      system,
      messages: await convertToModelMessages(messages),
      maxRetries: 2,
    });

    const sessionIdForHeader = chatSessionId;

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        onFinish: async ({ responseMessage }) => {
          const text = getTextFromUIMessage(responseMessage);
          if (!text) return;
          await prisma.message.create({
            data: {
              chatSessionId: sessionIdForHeader,
              role: "ASSISTANT",
              content: text,
            },
          });
          await prisma.chatSession.update({
            where: { id: sessionIdForHeader },
            data: { updatedAt: new Date() },
          });
        },
      }),
      headers: {
        // Client can read this to keep using the same session
        "X-Chat-Session-Id": sessionIdForHeader,
      },
    });
  } catch (err) {
    console.error("[chat]", err);
    const message = err instanceof Error ? err.message : "Chat failed";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}