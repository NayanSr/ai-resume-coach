"use client";

import { useState } from "react";
import { Loader2, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioReview } from "@/src/lib/ai/portfolio-schema";
// import type { PortfolioReview } from "@/lib/ai/portfolio-schema";
import { EmptyState } from "@/components/shared/empty-state";

export function PortfolioReviewPanel() {
  const [url, setUrl] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<PortfolioReview | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, description, targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");
      setReview(data.review as PortfolioReview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layout className="h-4 w-4" />
            Portfolio review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="url">Portfolio URL (optional)</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://yoursite.dev"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Target role (optional)</Label>
              <Input
                id="role"
                placeholder="e.g. Full-stack Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">
                Projects / about text (paste README highlights, case studies…)
              </Label>
              <Textarea
                id="desc"
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe 2–4 projects: problem, your role, stack, impact…"
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading || description.length < 40}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reviewing…
                </>
              ) : (
                "Review portfolio"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {!review && !loading && (
        <EmptyState
          title="No review yet"
          description="Paste project write-ups (and optional URL) to get score, gaps, and quick wins."
        />
      )}

      {review && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Score</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {review.overallScore}
              <span className="text-sm font-normal text-muted-foreground"> / 100</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {review.summary}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-emerald-700 dark:text-emerald-400">
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {review.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-amber-700 dark:text-amber-400">
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {review.weaknesses.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {review.projectSuggestions.map((p) => (
                <div key={p.area + p.suggestion} className="rounded-md border p-3 text-sm">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-medium">{p.area}</span>
                    <Badge variant="outline">{p.priority}</Badge>
                  </div>
                  <p className="text-muted-foreground">{p.suggestion}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          {review.missingElements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing elements</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {review.missingElements.map((m) => (
                  <Badge key={m} variant="secondary">
                    {m}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick wins</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {review.quickWins.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}