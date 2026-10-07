"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <Badge variant="secondary">
          Production-ready AI coach
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Resume ও Portfolio কে Job-ready করো AI দিয়ে
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          PDF আপলোড করো, স্কোর ও সাজেশন নাও, Job Description অনুযায়ী rewrite করো,
          আর চ্যাট কোচের সাথে ইন্টারঅ্যাকটিভ ফিডব্যাক নাও।
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/dashboard" />}
            size="lg"
          >
            Start coaching
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/#features" />}
            size="lg"
            variant="outline"
          >
            <FileText className="mr-2 h-4 w-4" />
            See features
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
