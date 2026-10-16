import { analyzeResumeText } from "@/src/lib/ai/analyze-resume";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
// import { analyzeResumeText } from "@/lib/ai/analyze-resume";

export const runtime = "nodejs";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const user = await requireDbUser();
    const { id } = await params;

    const resume = await prisma.resume.findFirst({
      where: { id, userId: user.id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!resume.rawText || resume.rawText.length < 40) {
      return NextResponse.json(
        { error: "Resume has no extractable text to analyze" },
        { status: 422 }
      );
    }

    const analysis = await analyzeResumeText(resume.rawText);

    // Keep upload meta, merge AI result
    const prevMeta =
      resume.analysisJson && typeof resume.analysisJson === "object"
        ? (resume.analysisJson as Record<string, unknown>)
        : {};

    const analysisJson = {
      ...prevMeta,
      ai: analysis,
      analyzedAt: new Date().toISOString(),
    };

    const updated = await prisma.resume.update({
      where: { id: resume.id },
      data: {
        analysisJson,
        score: Math.round(analysis.overallScore),
        status: "ANALYZED",
      },
    });

    return NextResponse.json({
      id: updated.id,
      score: updated.score,
      status: updated.status,
      analysis,
    });
  } catch (err) {
    console.error("[analyze]", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}