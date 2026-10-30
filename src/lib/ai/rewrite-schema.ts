import { z } from "zod";

export const rewriteSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("How well the current resume matches the JD, 0-100"),
  summary: z.string().describe("Short explanation of the tailoring strategy"),
  keywordGaps: z
    .array(z.string())
    .max(15)
    .describe("Important JD keywords missing from the resume"),
  rewrittenSummary: z
    .string()
    .describe("Improved professional summary tailored to the JD"),
  rewrittenBullets: z
    .array(
      z.object({
        originalHint: z
          .string()
          .describe("Which experience area this relates to"),
        bullet: z.string().describe("Strong, quantified bullet point"),
      })
    )
    .min(3)
    .max(10),
  skillsToHighlight: z.array(z.string()).max(20),
  coverLetterSnippet: z
    .string()
    .describe("Optional 4-6 sentence cover letter paragraph"),
});

export type RewriteResult = z.infer<typeof rewriteSchema>;