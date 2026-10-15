import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";


const MAX_CHARS = 100_000; // safety for AI later

export type ParsedResume = {
    text: string;
    pageCount?: number;
    wordCount: number;
    charCount: number;
};

function normalizeText(raw: string): string {
    return raw
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, MAX_CHARS);
}

function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length;
}

/* Old code show error in join in day3
 export async function parsePdf(buffer: ArrayBuffer): Promise<ParsedResume> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: true });
  const normalized = normalizeText(typeof text === "string" ? text : text.join("\n"));

  return {
    text: normalized,
    pageCount: totalPages,
    wordCount: countWords(normalized),
    charCount: normalized.length,
  };
}
   */
export async function parsePdf(buffer: ArrayBuffer): Promise<ParsedResume> {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    const { totalPages, text } = await extractText(pdf, {
        mergePages: true,
    });

    const normalized = normalizeText(text);

    return {
        text: normalized,
        pageCount: totalPages,
        wordCount: countWords(normalized),
        charCount: normalized.length,
    };
}

export async function parseDocx(buffer: ArrayBuffer): Promise<ParsedResume> {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    const normalized = normalizeText(result.value);

    return {
        text: normalized,
        wordCount: countWords(normalized),
        charCount: normalized.length,
    };
}

export async function parseResumeFile(
    file: File
): Promise<ParsedResume & { kind: "pdf" | "docx" }> {
    const type = file.type;
    const name = file.name.toLowerCase();
    const buffer = await file.arrayBuffer();

    if (type === "application/pdf" || name.endsWith(".pdf")) {
        const parsed = await parsePdf(buffer);
        return { ...parsed, kind: "pdf" };
    }

    if (
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        name.endsWith(".docx")
    ) {
        const parsed = await parseDocx(buffer);
        return { ...parsed, kind: "docx" };
    }

    throw new Error("Only PDF and DOCX files are supported");
}