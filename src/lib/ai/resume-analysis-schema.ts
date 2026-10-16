import { z } from "zod";

export const sectionSuggestionSchema = z.object({
  section: z
    .string()
    .describe("Resume section name, e.g. Summary, Experience, Skills, Education"),
  issue: z.string().describe("What is weak or missing in this section"),
  suggestion: z.string().describe("Concrete rewrite or improvement advice"),
  priority: z.enum(["high", "medium", "low"]),
});

export const resumeAnalysisSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall resume quality score from 0 to 100"),
  atsScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Likely ATS parse/match friendliness from 0 to 100"),
  summary: z
    .string()
    .describe("2-4 sentence overall assessment of the resume"),
  strengths: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe("Clear strengths of this resume"),
  weaknesses: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe("Clear weaknesses or risks"),
  sectionSuggestions: z
    .array(sectionSuggestionSchema)
    .min(2)
    .max(8)
    .describe("Section-by-section actionable suggestions"),
  missingKeywords: z
    .array(z.string())
    .max(12)
    .describe("Useful keywords/skills that appear missing for common tech roles"),
  quickWins: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("Fast improvements the candidate can do in under 30 minutes"),
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;