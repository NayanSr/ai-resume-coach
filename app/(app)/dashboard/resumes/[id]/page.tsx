import { notFound } from "next/navigation";
import Link from "next/link";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import { ResumePreview } from "@/components/resume/resume-preview";
import { Button } from "@/components/ui/button";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function ResumeDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireDbUser();

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });

  if (!resume) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <Button render={<Link href="/dashboard"/>} nativeButton={false} variant="ghost" size="sm">
        ← Back to dashboard
      </Button>
      <ResumePreview
        title={resume.title}
        fileName={resume.fileName}
        fileUrl={resume.fileUrl}
        status={resume.status}
        rawText={resume.rawText}
        analysisJson={resume.analysisJson}
      />
    </div>
  );
}