"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/pricing";

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="text-3xl font-semibold tracking-tight">Questions before you start</h2>
      <Accordion.Root type="single" collapsible className="mt-8 space-y-3">
        {faqs.map((item) => (
          <Accordion.Item key={item.q} value={item.q} className="glass overflow-hidden">
            <Accordion.Header>
              <Accordion.Trigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium">
                {item.q}
                <ChevronDown className="h-4 w-4 text-white/50" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-5 pb-4 text-sm text-white/60">{item.a}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
