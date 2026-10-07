const steps = [
  { step: "01", title: "Upload", text: "Resume PDF/DOCX আপলোড করো।" },
  { step: "02", title: "Analyze", text: "AI স্কোর ও সাজেশন দেয়।" },
  { step: "03", title: "Tailor", text: "JD অনুযায়ী rewrite ও চ্যাট করো।" },
  { step: "04", title: "Export", text: "Improved PDF ডাউনলোড করো।" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 text-center text-3xl font-semibold">কীভাবে কাজ করে</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((item) => (
          <div key={item.step} className="rounded-xl border p-5">
            <p className="text-sm font-medium text-primary">{item.step}</p>
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}