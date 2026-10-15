import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Meta = {
  kind?: string;
  pageCount?: number | null;
  wordCount?: number;
  charCount?: number;
};

type Props = {
  title: string;
  fileName: string | null;
  fileUrl: string | null;
  status: string;
  rawText: string | null;
  analysisJson: unknown;
};

function readMeta(json: unknown): Meta {
  if (json && typeof json === "object") return json as Meta;
  return {};
}

export function ResumePreview({
  title,
  fileName,
  fileUrl,
  status,
  rawText,
  analysisJson,
}: Props) {
  const meta = readMeta(analysisJson);
  const preview = rawText?.slice(0, 4000) ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{status}</Badge>
          {meta.kind && <Badge variant="outline">{meta.kind.toUpperCase()}</Badge>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Words</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {meta.wordCount ?? "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Characters</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {meta.charCount ?? "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pages</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {meta.pageCount ?? "—"}
          </CardContent>
        </Card>
      </div>

      {fileUrl && (
        <p className="text-sm">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Open original file
          </a>
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Extracted text (preview)</CardTitle>
        </CardHeader>
        <CardContent>
          {preview ? (
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-md border bg-muted/40 p-4 text-sm leading-relaxed">
              {preview}
              {rawText && rawText.length > 4000 ? "\n\n…" : ""}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No text extracted.</p>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        AI score, strengths/weaknesses এবং section-wise suggestion আসবে{" "}
        <strong>Day 4</strong>-এ।
      </p>
    </div>
  );
}