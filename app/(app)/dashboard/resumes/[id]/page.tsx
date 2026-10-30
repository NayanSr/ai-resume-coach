import { notFound } from "next/navigation";
import Link from "next/link";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import { ResumePreview } from "@/components/resume/resume-preview";
import { AnalysisResult } from "@/components/resume/analysis-result";
import { AnalyzeButton } from "@/components/resume/analyze-button";
import { CoachChat } from "@/components/chat/coach-chat";
import { JobRewritePanel } from "@/components/resume/job-rewrite-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  resumeAnalysisSchema,
  type ResumeAnalysis,
} from "@/src/lib/ai/resume-analysis-schema";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import { ResumePdfDownload } from "@/components/resume/resume-pdf-download";
import { ResumeMarkdownDownload } from "@/components/resume/resume-markdown-download";
import { buildPdfDataFromResume } from "@/src/lib/resume-export";
import { FadeIn } from "@/components/shared/fade-in";

type Props = { params: Promise<{ id: string }> };

function extractAnalysis(json: unknown): ResumeAnalysis | null {
  if (!json || typeof json !== "object") return null;
  const ai = (json as { ai?: unknown }).ai;
  const parsed = resumeAnalysisSchema.safeParse(ai);
  return parsed.success ? parsed.data : null;
}

export default async function ResumeDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireDbUser();

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });
  if (!resume) notFound();

  const pdfData = buildPdfDataFromResume(resume);
  const safeName = resume.title.replace(/[^\w.-]+/g, "_") || "resume";

  // const analysis = extractAnalysis(resume.analysisJson);

  const latestSession = await prisma.chatSession.findFirst({
    where: { userId: user.id, resumeId: resume.id },
    orderBy: { updatedAt: "desc" },
  });

  const analysis = extractAnalysis(resume.analysisJson);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      {/* For Animation */}
      <FadeIn className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
          ← Back
        </Button>
        <div className="flex flex-wrap gap-2">
          <AnalyzeButton resumeId={resume.id} />
          <ResumePdfDownload data={pdfData} fileName={`${safeName}.pdf`} />
          <ResumeMarkdownDownload data={pdfData} fileName={`${safeName}.md`} />
        </div>
        <AnalyzeButton resumeId={resume.id} />
      </div>

      <ResumePreview
        title={resume.title}
        fileName={resume.fileName}
        fileUrl={resume.fileUrl}
        status={resume.status}
        rawText={resume.rawText}
        analysisJson={resume.analysisJson}
      />

      <Tabs defaultValue="analysis">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="chat">Chat coach</TabsTrigger>
          <TabsTrigger value="rewrite">Job rewrite</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-4 space-y-4">
          {analysis ? (
            <AnalysisResult analysis={analysis} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Analyze with AI চাপো — score ও suggestions আসবে।
            </p>
          )}
        </TabsContent>

        <TabsContent value="chat" className="mt-4">
          <CoachChat
            resumeId={resume.id}
            initialSessionId={latestSession?.id}
          />
        </TabsContent>

        <TabsContent value="rewrite" className="mt-4">
          <JobRewritePanel resumeId={resume.id} />
        </TabsContent>
      </Tabs>
      </FadeIn>
    </div>
  );
}

/* import { notFound } from "next/navigation";
import Link from "next/link";
// import { requireDbUser } from "@/lib/auth";
// import { prisma } from "@/lib/db";
import { ResumePreview } from "@/components/resume/resume-preview";
import { AnalysisResult } from "@/components/resume/analysis-result";
import { AnalyzeButton } from "@/components/resume/analyze-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { requireDbUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";
import {
  resumeAnalysisSchema,
  type ResumeAnalysis,
} from "@/src/lib/ai/resume-analysis-schema";
// import {
//   resumeAnalysisSchema,
//   type ResumeAnalysis,
// } from "@/lib/ai/resume-analysis-schema";

type Props = { params: Promise<{ id: string }> };

function extractAnalysis(json: unknown): ResumeAnalysis | null {
  if (!json || typeof json !== "object") return null;
  const ai = (json as { ai?: unknown }).ai;
  const parsed = resumeAnalysisSchema.safeParse(ai);
  return parsed.success ? parsed.data : null;
}

export default async function ResumeDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireDbUser();

  const resume = await prisma.resume.findFirst({
    where: { id, userId: user.id },
  });

  if (!resume) notFound();

  const analysis = extractAnalysis(resume.analysisJson);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button render={<Link href="/dashboard"/>} nativeButton={false} variant="ghost" size="sm">
          ← Back to dashboard
        </Button>
        <AnalyzeButton resumeId={resume.id} />
      </div>

      <ResumePreview
        title={resume.title}
        fileName={resume.fileName}
        fileUrl={resume.fileUrl}
        status={resume.status}
        rawText={resume.rawText}
        analysisJson={resume.analysisJson}
      />

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">AI analysis</h2>
        {analysis ? (
          <AnalysisResult analysis={analysis} />
        ) : (
          <p className="text-sm text-muted-foreground">
            এখনো analysis নেই। উপরের <strong>Analyze with AI</strong> বাটনে চাপো।
          </p>
        )}
      </section>
    </div>
  );
} */





/* import { notFound } from "next/navigation";
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
} */