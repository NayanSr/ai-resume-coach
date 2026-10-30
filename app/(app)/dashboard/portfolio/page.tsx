import { PortfolioReviewPanel } from "@/components/portfolio/portfolio-review-panel";

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-semibold">Portfolio coach</h1>
        <p className="text-muted-foreground">
          URL ও project notes দিয়ে hiring-focused feedback নাও।
        </p>
      </div>
      <PortfolioReviewPanel />
    </div>
  );
}