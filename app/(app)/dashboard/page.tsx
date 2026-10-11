// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { requireDbUser } from "@/src/lib/auth";

export default async function DashboardPage() {
  const user = await requireDbUser();

  const [resumeCount, sessionCount] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.chatSession.count({ where: { userId: user.id } }),
  ]);

  const recentResumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            Resume history ও coaching session এখানে দেখা যাবে।
          </p>
        </div>
        <Button render={<Link href="/dashboard"/>} nativeButton={false}>
          Upload resume (Day 3)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{resumeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Chat sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{sessionCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Account</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="truncate text-sm">{user.email}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent resumes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentResumes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              এখনো কোনো resume নেই। Day 3-এ upload ফিচার আসবে।
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recentResumes.map((r) => (
                <li key={r.id} className="flex justify-between border-b py-2 last:border-0">
                  <span>{r.title}</span>
                  <span className="text-muted-foreground">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}