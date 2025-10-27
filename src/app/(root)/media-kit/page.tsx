"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Download, Mail, Mic2, Users, Lightbulb, Share2 } from "lucide-react";
import profilePic from "../../../assets/chris.png"; // ⬅️ keeping the same image src as requested

export default function MediaKit() {
  const [email, setEmail] = useState("");

  const topics = [
    { icon: <Lightbulb className="w-5 h-5" />, title: "Entrepreneurship" },
    { icon: <Mic2 className="w-5 h-5" />, title: "Jiu Jitsu" },
    { icon: <Share2 className="w-5 h-5" />, title: "Business" },
    { icon: <Share2 className="w-5 h-5" />, title: "Marketing" },
    { icon: <Lightbulb className="w-5 h-5" />, title: "AI" },
    { icon: <Users className="w-5 h-5" />, title: "Community Building" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Media Kit
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                Chris Gray's{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Media Kit
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Looking for a podcast guest, speaker, or a value-packed
                training? You're in the right place. Thanks for stopping by!
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.dropbox.com/scl/fi/2i02qu2cyhwmuc8qalngv/profilepic1.heic?rlkey=iulrx5k1thhogn82snwo1h9vc&e=1&st=sxofyytb&dl=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-border bg-primary px-5 py-3 text-primary-foreground shadow-sm transition hover:shadow-md"
                >
                  <Download className="h-5 w-5 transition group-hover:scale-110" />
                  <span>Download Profile Image</span>
                </a>
                <a
                  href="mailto:Marisol@redpalm.us"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-3 backdrop-blur transition hover:bg-card"
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact</span>
                </a>
              </div>
            </div>

            {/* Image card */}
            <div className="relative mx-auto w-full max-w-md">
              {/* Subtle animated blobs for movement */}
              <div
                aria-hidden
                className="prm-pause pointer-events-none absolute -top-10 -left-6 h-32 w-32 rounded-full bg-primary/25 blur-3xl md:h-48 md:w-48 lg:h-56 lg:w-56"
                style={{ animation: "floatSlow 18s ease-in-out infinite" }}
              />
              <div
                aria-hidden
                className="prm-pause pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-accent/20 blur-3xl md:h-40 md:w-40 lg:h-48 lg:w-48"
                style={{ animation: "floatSlowAlt 22s ease-in-out infinite" }}
              />
              <div className="rounded-3xl border border-border bg-card p-2 shadow-xl">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <Image
                    src={profilePic}
                    alt="Chris Gray"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between px-3 pb-3 pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Co-owner, Red Palm Studios
                    </p>
                    <p className="text-sm">Host, Big Life Podcast</p>
                  </div>
                  <div className="rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-3 py-1 text-xs text-muted-foreground">
                    Available for interviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global keyframes for subtle movement (respects reduced motion) */}
      <style jsx global>{`
        @keyframes floatSlow {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(6px, -4px, 0) scale(1.02);
          }
          50% {
            transform: translate3d(12px, -10px, 0) scale(1.06);
          }
          75% {
            transform: translate3d(6px, -4px, 0) scale(1.02);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes floatSlowAlt {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(-6px, 5px, 0) scale(1.03);
          }
          50% {
            transform: translate3d(-12px, 10px, 0) scale(1.06);
          }
          75% {
            transform: translate3d(-6px, 5px, 0) scale(1.03);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .prm-pause {
            animation: none !important;
          }
        }
      `}</style>

      {/* About */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-border bg-card/70 p-8 backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              About Chris
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-foreground md:text-lg">
              <p>
                Chris Gray is the co-owner of{" "}
                <span className="font-semibold">Red Palm Studios</span>, a
                forward-thinking marketing agency serving big brands and small
                businesses within the trades industry. An entrepreneur at heart,
                Chris turned a personal passion into a thriving business with{" "}
                <span className="font-semibold">Bald Buck Seasoning</span>.
              </p>
              <p>
                He continues to innovate through the{" "}
                <span className="font-semibold">Bald Buck Newsletter</span>, a
                go-to resource for senior citizens seeking relevant updates on
                topics that matter most to them. As the founder of the{" "}
                <span className="font-semibold">EARN CORE COMMUNITY</span>,
                Chris has brought together over 4,000 entrepreneurs. In
                addition, he is co-host of the{" "}
                <span className="font-semibold">Big Life Podcast</span> with
                Dmitri Smirnoff.
              </p>
              <p>
                Away from work, Chris is a devoted husband and father, a
                committed Brazilian jiu-jitsu practitioner, and an "undercover
                geek." Whether elevating brands, perfecting a new seasoning
                blend, or sharpening his (self-proclaimed) mediocre Jiu Jitsu
                skills, he brings passion and determination to every facet of
                life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Discussion Topics
          </h2>
          <p className="mt-3 text-muted-foreground">
            Including but not limited to
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-border bg-card/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                    {topic.icon}
                  </div>
                  <span className="text-base font-semibold md:text-lg">
                    {topic.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Topics */}
          <div className="mt-10 rounded-2xl border border-border bg-background/60 p-6 backdrop-blur">
            <h3 className="text-xl font-semibold">Plus These & More</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Lead Generation",
                "Family",
                "Newsletters",
                "Digital Marketing",
                "Social Media",
                "Email Marketing",
                "Paid Advertising",
                "Community Building",
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-3xl border border-border bg-card/70 p-8 backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              What Chris Wants From You
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="text-base leading-relaxed md:text-lg">
                  Chris wants to add value to your followers with an authentic
                  yet tactical conversation. The goal: your audience leaves with
                  at least one tip they can implement today.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6">
                <p className="text-base leading-relaxed md:text-lg">
                  After recording, Chris will share the assets you provide
                  across his social channels and community to help maximize
                  reach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
            Ready to Collaborate?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            For any further questions, please contact us.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="mailto:Marisol@redpalm.us">
              <button className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                Get in Touch
              </button>
            </a>
            <a
              href="mailto:Marisol@redpalm.us"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-3 backdrop-blur transition hover:bg-card"
            >
              <Mail className="h-5 w-5" /> Marisol@redpalm.us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/70 py-8 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} EARN CORE COMMUNITY. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
