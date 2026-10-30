"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResumePdfDocument,
  type ResumePdfData,
} from "@/components/resume/resume-pdf-document";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

export function ResumePdfDownload({
  data,
  fileName,
}: {
  data: ResumePdfData;
  fileName: string;
}) {
  return (
    <PDFDownloadLink
      document={<ResumePdfDocument data={data} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button type="button" variant="outline" disabled={loading}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? "Preparing PDF…" : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}