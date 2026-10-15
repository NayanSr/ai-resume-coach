"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MAX_MB = 4;

export function ResumeUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("একটি PDF বা DOCX ফাইল বেছে নাও");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`ফাইল ${MAX_MB} MB-এর কম হতে হবে`);
      return;
    }

    setLoading(true);
    setProgress("Uploading & parsing…");

    try {
      const form = new FormData();
      form.append("file", file);
      if (title.trim()) form.append("title", title.trim());

      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setProgress("Done — opening preview…");
      router.push(`/dashboard/resumes/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5" />
          Upload resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g. Software Engineer – 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">PDF or DOCX (max {MAX_MB} MB)</Label>
            <Input
              id="file"
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={loading}
              onChange={() => {
                const f = inputRef.current?.files?.[0];
                setFileName(f?.name ?? null);
                setError(null);
              }}
            />
            {fileName && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {fileName}
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {progress && !error && (
            <p className="text-sm text-muted-foreground">{progress}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Upload & parse"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}