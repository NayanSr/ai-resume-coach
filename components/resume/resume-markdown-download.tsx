"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResumePdfData } from "@/components/resume/resume-pdf-document";

export function ResumeMarkdownDownload({
  data,
  fileName,
}: {
  data: ResumePdfData;
  fileName: string;
}) {
  function onDownload() {
    const lines: string[] = [`# ${data.title}`, ""];
    if (data.summary) {
      lines.push("## Summary", data.summary, "");
    }
    if (data.bullets?.length) {
      lines.push("## Experience bullets");
      for (const b of data.bullets) {
        lines.push(`- **${b.originalHint}:** ${b.bullet}`);
      }
      lines.push("");
    }
    if (data.skills?.length) {
      lines.push("## Skills", data.skills.join(", "), "");
    }
    if (!data.summary && !data.bullets?.length) {
      lines.push(data.rawFallback || "");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="ghost" onClick={onDownload}>
      <FileDown className="mr-2 h-4 w-4" />
      Download Markdown
    </Button>
  );
}