import { getChatModel } from "@/src/lib/ai/model";
import { rewriteSchema } from "@/src/lib/ai/rewrite-schema";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
// import { getChatModel } from "@/lib/ai/model";
// import { rewriteSchema } from "@/lib/ai/rewrite-schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  jobDescription: z.string().min(40).max(12_000),
  jobTitle: z.string().max(200).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;
    const parsedBody = bodySchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "jobDescription is required (min 40 chars)" },
        { status: 400 }
      );
    }

    const { jobDescription, jobTitle } = parsedBody.data;

    const resume = await prisma.resume.findFirst({
      where: { id, userId: user.id },
    });
    if (!resume?.rawText) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const { output } = await generateText({
      model: getChatModel(),
      system: `You are an expert resume writer specializing in job-tailored rewrites.
Only use experience present in the resume. Do not invent employers or degrees.
Prefer strong action verbs and measurable impact.
Align language with the job description without keyword stuffing.`,
      output: Output.object({ schema: rewriteSchema }),
      prompt: `Tailor this resume to the job.

JOB TITLE: ${jobTitle || "Not specified"}

JOB DESCRIPTION:
---
${jobDescription.slice(0, 10_000)}
---

RESUME:
---
${resume.rawText.slice(0, 12_000)}
---`,
      maxRetries: 2,
    });

    if (!output) {
      return NextResponse.json({ error: "Empty rewrite" }, { status: 500 });
    }

    const prev =
      resume.analysisJson && typeof resume.analysisJson === "object"
        ? (resume.analysisJson as Record<string, unknown>)
        : {};

    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        status: "REWRITTEN",
        analysisJson: {
          ...prev,
          lastRewrite: {
            ...output,
            jobTitle: jobTitle || null,
            rewrittenAt: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json({ rewrite: output });
  } catch (err) {
    console.error("[rewrite]", err);
    const message = err instanceof Error ? err.message : "Rewrite failed";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}