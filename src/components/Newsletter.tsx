"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // No database — just show the thank-you feedback.
    setSubscribed(true);
    setEmail("");

    window.setTimeout(() => setSubscribed(false), 4000);
  }

  return (
    <section className="bg-white px-4 py-16 transition-colors dark:bg-gray-950 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#176B50] px-6 py-14 shadow-xl sm:px-12 lg:px-16">

          {/* Background Decoration */}
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-35 border-white/5" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-35 border-white/5" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">

            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
              <Mail size={30} />
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Stay Connected With Us
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
              Subscribe to our newsletter and stay updated
              with upcoming events, community activities,
              inspiring stories, and opportunities to make
              a difference.
            </p>

            {/* Newsletter Form */}
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row sm:rounded-full"
            >

              <div className="flex flex-1 items-center gap-3 px-4">
                <Mail size={20} className="shrink-0 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  aria-label="Email address"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-bold transition-all duration-300 sm:rounded-full ${
                  subscribed
                    ? "cursor-default bg-emerald-100 text-[#12543E]"
                    : "bg-[#176B50] text-white hover:bg-[#12543E]"
                }`}
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={18} />
                    Thanks for Subscribing!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            {/* Thank-you feedback message */}
            {subscribed ? (
              <p
                role="status"
                className="mt-5 text-xs font-bold text-white"
              >
                <CheckCircle2 size={13} className="mr-1 inline" />
                Thanks for subscribing — you&apos;ll hear from us soon!
              </p>
            ) : (
              <p className="mt-5 text-xs text-emerald-100">
                <Send size={13} className="mr-1 inline" />
                Join our community and spread positivity.
              </p>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
