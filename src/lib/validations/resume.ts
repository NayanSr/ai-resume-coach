import { z } from "zod";

export const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4 MB (under Vercel 4.5 MB limit)

export const ALLOWED_MIME = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export function assertResumeFile(file: File) {
  const name = file.name.toLowerCase();
  const okMime = (ALLOWED_MIME as readonly string[]).includes(file.type);
  const okExt = name.endsWith(".pdf") || name.endsWith(".docx");

  if (!okMime && !okExt) {
    throw new Error("Only PDF or DOCX files are allowed");
  }
  if (file.size > MAX_RESUME_BYTES) {
    throw new Error("File must be 4 MB or smaller");
  }
  if (file.size === 0) {
    throw new Error("File is empty");
  }
}

export const createResumeMetaSchema = z.object({
  title: z.string().min(1).max(120).optional(),
});