import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { parseResumeFile } from "@/src/lib/parse-resume";
import { assertResumeFile } from "@/src/lib/validations/resume";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";



export const runtime = "nodejs"; // unpdf / mammoth need Node, not Edge

export async function POST(request: Request) {
  try {
    const user = await requireDbUser();

    const form = await request.formData();
    const file = form.get("file");
    const titleRaw = form.get("title");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    assertResumeFile(file);

    const title =
      typeof titleRaw === "string" && titleRaw.trim()
        ? titleRaw.trim().slice(0, 120)
        : file.name.replace(/\.(pdf|docx)$/i, "") || "Untitled Resume";

    // 1) Parse text first (fail fast before storing blob)
    const parsed = await parseResumeFile(file);

    if (!parsed.text || parsed.text.length < 40) {
      return NextResponse.json(
        { error: "Could not extract enough text from this file" },
        { status: 422 }
      );
    }

    // 2) Upload to Vercel Blob
    const pathname = `resumes/${user.id}/${Date.now()}-${file.name}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
    });

    // 3) Save DB row
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title,
        fileName: file.name,
        fileUrl: blob.url,
        rawText: parsed.text,
        status: "UPLOADED",
        analysisJson: {
          kind: parsed.kind,
          pageCount: parsed.pageCount ?? null,
          wordCount: parsed.wordCount,
          charCount: parsed.charCount,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      id: resume.id,
      title: resume.title,
      fileUrl: resume.fileUrl,
      wordCount: parsed.wordCount,
      charCount: parsed.charCount,
      pageCount: parsed.pageCount ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    const status =
      message === "Unauthorized" || message.includes("Unauthorized")
        ? 401
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}