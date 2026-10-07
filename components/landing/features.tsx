import {
  Briefcase,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Resume Analysis",
    description: "Score, strengths, weaknesses এবং section-wise suggestion।",
    icon: ScanSearch,
  },
  {
    title: "Job Tailoring",
    description: "Job Description দিয়ে targeted rewrite।",
    icon: Briefcase,
  },
  {
    title: "Chat Coach",
    description: "Streaming AI চ্যাট দিয়ে ইন্টারঅ্যাকটিভ গাইডেন্স।",
    icon: MessageSquare,
  },
  {
    title: "PDF Export",
    description: "Improved resume PDF/Markdown ডাউনলোড।",
    icon: FileText,
  },
  {
    title: "Portfolio Review",
    description: "পোর্টফোলিও URL/ডেসক্রিপশন রিভিউ।",
    icon: Sparkles,
  },
  {
    title: "Dashboard & History",
    description: "লগইন, হিস্টরি এবং প্রোগ্রেস ট্র্যাকিং।",
    icon: LayoutDashboard,
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-semibold">মূল ফিচার</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {feature.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}