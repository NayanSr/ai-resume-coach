import { ResumeUploader } from "@/components/resume/resume-uploader";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-10">
      
      <div>
        <h1 className="text-3xl font-semibold">Upload resume</h1>
        <p className="text-muted-foreground">
          PDF বা DOCX আপলোড করো — আমরা টেক্সট এক্সট্র্যাক্ট করে সেভ করব।
        </p>
      </div>
      <ResumeUploader />
    </div>
  );
}