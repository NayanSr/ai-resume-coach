import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            আজকে শুধু skeleton। কাল থেকে auth ও ডেটা আসবে।
          </p>
        </div>
        <Button disabled>Upload resume</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {["Resumes", "Analyses", "Chat sessions"].map((label) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">—</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          কোনো হিস্টরি নেই। Day 2-এ ডাটাবেস কানেক্ট করলে এখানে লিস্ট আসবে।
        </CardContent>
      </Card>
    </div>
  );
}