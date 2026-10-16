import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumeAnalysis } from "@/src/lib/ai/resume-analysis-schema";
// import type { ResumeAnalysis } from "@/lib/ai/resume-analysis-schema";

function ScoreRing({ label, value }: { label: string; value: number }) {
  const color =
    value >= 80 ? "text-emerald-600" : value >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-semibold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">/ 100</p>
      </CardContent>
    </Card>
  );
}

function priorityVariant(p: "high" | "medium" | "low") {
  if (p === "high") return "destructive" as const;
  if (p === "medium") return "default" as const;
  return "secondary" as const;
}

export function AnalysisResult({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <ScoreRing label="Overall score" value={analysis.overallScore} />
        <ScoreRing label="ATS score" value={analysis.atsScore} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          {analysis.summary}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-emerald-700 dark:text-emerald-400">
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {analysis.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-amber-700 dark:text-amber-400">
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {analysis.weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Section suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis.sectionSuggestions.map((item) => (
            <div key={`${item.section}-${item.issue}`} className="rounded-lg border p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="font-medium">{item.section}</p>
                <Badge variant={priorityVariant(item.priority)}>{item.priority}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Issue: </span>
                {item.issue}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Suggestion: </span>
                {item.suggestion}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {analysis.missingKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Missing keywords</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((k) => (
              <Badge key={k} variant="outline">
                {k}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick wins</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {analysis.quickWins.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}