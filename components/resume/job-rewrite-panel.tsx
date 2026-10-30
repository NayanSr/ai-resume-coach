"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RewriteResult } from "@/src/lib/ai/rewrite-schema";

export function JobRewritePanel({ resumeId }: { resumeId: string }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RewriteResult | null>(null);

  async function onRewrite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setResult(data.rewrite as RewriteResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job-tailored rewrite</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onRewrite} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job title (optional)</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jd">Job description</Label>
              <Textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description…"
                rows={8}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading || jobDescription.length < 40}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rewriting…
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Tailor resume
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Match score: {result.matchScore}/100</Badge>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Strategy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {result.summary}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rewritten summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm whitespace-pre-wrap">
              {result.rewrittenSummary}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggested bullets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.rewrittenBullets.map((b, i) => (
                <div key={i} className="rounded-md border p-3 text-sm">
                  <p className="mb-1 text-xs text-muted-foreground">
                    {b.originalHint}
                  </p>
                  <p>{b.bullet}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {result.keywordGaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Keyword gaps</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.keywordGaps.map((k) => (
                  <Badge key={k} variant="outline">
                    {k}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Skills to highlight</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {result.skillsToHighlight.map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cover letter snippet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm whitespace-pre-wrap">
              {result.coverLetterSnippet}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}