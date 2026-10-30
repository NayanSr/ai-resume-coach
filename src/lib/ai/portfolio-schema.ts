import { z } from "zod";

export const portfolioReviewSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()).min(2).max(6),
  weaknesses: z.array(z.string()).min(2).max(6),
  projectSuggestions: z
    .array(
      z.object({
        area: z.string().describe("e.g. Case study depth, README, demo"),
        suggestion: z.string(),
        priority: z.enum(["high", "medium", "low"]),
      })
    )
    .min(2)
    .max(8),
  missingElements: z
    .array(z.string())
    .max(12)
    .describe("Common portfolio elements that appear missing"),
  quickWins: z.array(z.string()).min(2).max(5),
});

export type PortfolioReview = z.infer<typeof portfolioReviewSchema>;