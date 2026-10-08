"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { processTicket } from "./actions";

export default function Home() {
  const [text, setText] = useState(    
    `I've been charged twice for my subscription. I've already contacted support about this, and I need someone to refund the duplicate charge. `.trim(),
  );
  async function onAnalyzeClick() {
    try {
      const response = await processTicket();
      console.log({ response });
    } catch {
    } finally {
    }
  }
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Customer Support Ticket Analyzer
          </h1>
          <p className="text-muted-foreground">
            Analyze customer support tickets using JEV.
          </p>
        </div>

        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={8}
          placeholder="Enter a customer support ticket..."
        />
        <Button onClick={onAnalyzeClick}>Analyze Ticket</Button>
      </div>
    </main>
  );
}
