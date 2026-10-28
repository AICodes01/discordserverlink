"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({
  faqs,
  title = "Frequently Asked Questions",
  description = "Everything you need to know, answered clearly.",
}: {
  faqs: FAQItem[];
  title?: string;
  description?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
        <div className="p-2.5 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-zinc-950 border-discord-blurple/40 shadow-glow-sm"
                  : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-zinc-100">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-discord-blurple transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 mt-1 prose prose-invert max-w-none">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
