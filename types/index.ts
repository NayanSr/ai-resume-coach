export type ResumeStatus = "uploaded" | "analyzed" | "rewritten";

export type FeatureItem = {
  title: string;
  description: string;
  icon: "scan" | "sparkles" | "message" | "briefcase" | "file" | "layout";
};