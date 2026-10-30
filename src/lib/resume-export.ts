import type { ResumePdfData } from "@/components/resume/resume-pdf-document";

export function buildPdfDataFromResume(resume: {
  title: string;
  rawText: string | null;
  analysisJson: unknown;
}): ResumePdfData {
  const json =
    resume.analysisJson && typeof resume.analysisJson === "object"
      ? (resume.analysisJson as Record<string, unknown>)
      : {};

  const last = json.lastRewrite as
    | {
        rewrittenSummary?: string;
        rewrittenBullets?: { originalHint: string; bullet: string }[];
        skillsToHighlight?: string[];
      }
    | undefined;

  return {
    title: resume.title,
    summary: last?.rewrittenSummary,
    bullets: last?.rewrittenBullets,
    skills: last?.skillsToHighlight,
    rawFallback: resume.rawText ?? undefined,
  };
}