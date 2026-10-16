
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";

import {
  resumeAnalysisSchema,
  type ResumeAnalysis,
} from "./resume-analysis-schema";

const SYSTEM = `You are an expert technical recruiter and resume coach.
Analyze the resume text carefully.
Be specific, honest, and actionable.
Prefer measurable feedback over vague praise.
Do not invent employers, degrees, or skills that are not in the text.
Scores should reflect real quality for competitive software / tech roles.`;

export async function analyzeResumeText(
  rawText: string
): Promise<ResumeAnalysis> {
  const clipped = rawText.slice(0, 14_000);

  const { output } = await generateText({
    // model: google("gemini-3.8-flash"),
    model: google("gemini-3.5-flash-lite"),
    system: SYSTEM,
    output: Output.object({
      schema: resumeAnalysisSchema,
    }),
    prompt: `Analyze this resume and return structured feedback.

---
RESUME TEXT:
${clipped}
---`,
    maxRetries: 2,
  });

  if (!output) {
    throw new Error("AI returned empty analysis");
  }

  return output;
}






/* import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

import {
  resumeAnalysisSchema,
  type ResumeAnalysis,
} from "./resume-analysis-schema";

const SYSTEM = `You are an expert technical recruiter and resume coach.
Analyze the resume text carefully.
Be specific, honest, and actionable.
Prefer measurable feedback over vague praise.
Do not invent employers, degrees, or skills that are not in the text.
Scores should reflect real quality for competitive software / tech roles.`;

function getModel() {
  // AI Gateway path (preferred when AI_GATEWAY_API_KEY is set)
  if (process.env.AI_GATEWAY_API_KEY) {
    return "openai/gpt-4.1";
  }
  // Direct OpenAI
  return openai("gpt-4.1");
}

export async function analyzeResumeText(
  rawText: string
): Promise<ResumeAnalysis> {
  const clipped = rawText.slice(0, 14_000);

  const { output } = await generateText({
    // model: getModel(),
    model: google("gemini-3.8-flash"),
    system: SYSTEM,
    output: Output.object({
      schema: resumeAnalysisSchema,
    }),
    prompt: `Analyze this resume and return structured feedback.

---
RESUME TEXT:
${clipped}
---`,
  });

  if (!output) {
    throw new Error("AI returned empty analysis");
  }

  return output;
} */