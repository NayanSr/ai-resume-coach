import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDbUser } from "@/src/lib/auth";
import { getChatModel } from "@/src/lib/ai/model";
import { portfolioReviewSchema } from "@/src/lib/ai/portfolio-schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  url: z.string().url().optional().or(z.literal("")),
  description: z.string().min(40).max(12_000),
  targetRole: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    await requireDbUser();
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "description required (min 40 chars)" },
        { status: 400 }
      );
    }

    const { url, description, targetRole } = parsed.data;

    const { output } = await generateText({
      model: getChatModel(),
      system: `You are a senior hiring manager reviewing a software portfolio.
Be specific and actionable. Do not invent projects that are not described.
Focus on clarity, impact, tech depth, and hiring signal for tech roles.`,
      output: Output.object({ schema: portfolioReviewSchema }),
      prompt: `Review this portfolio for a candidate.

TARGET ROLE: ${targetRole || "Software / tech role"}
PORTFOLIO URL: ${url || "Not provided"}

DESCRIPTION / PROJECT NOTES:
---
${description.slice(0, 10_000)}
---`,
      maxRetries: 2,
    });

    if (!output) {
      return NextResponse.json({ error: "Empty review" }, { status: 500 });
    }

    return NextResponse.json({ review: output });
  } catch (err) {
    console.error("[portfolio]", err);
    const message = err instanceof Error ? err.message : "Review failed";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}