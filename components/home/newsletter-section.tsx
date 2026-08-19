"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { siteConfig } from "@/lib/content";

export function NewsletterSection() {
  const { newsletter } = siteConfig.home;
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast.success("ثبت شد", {
      description: "به‌محض انتشار مجموعه بعدی، به شما اطلاع می‌دهیم.",
    });
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <Reveal>
        <h2 className="text-2xl font-bold sm:text-3xl">{newsletter.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {newsletter.description}
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-7 flex max-w-sm flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholder}
            className="flex-1 text-end"
          />
          <Button type="submit" className="bg-dark-blue">{newsletter.cta}</Button>
        </form>
      </Reveal>
    </section>
  );
}
