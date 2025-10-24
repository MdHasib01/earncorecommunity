"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Download, Mail, Mic2, Users, Lightbulb, Share2 } from "lucide-react";
import profilePic from "../../../assets/chris.png";

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
    <div className="min-h-screen bg-background ">
      {/* Hero Section with New Layout */}
      <section className="py-20 bg-background">
        <div className="mx-auto px-4 ">
          {/* Title */}
          <h1 className="text-5xl bg-primary md:text-6xl font-bold mb-12 text-primary-foreground text-center py-10 rounded-2xl border border-border">
            Chris Gray's <span className="text-accent">Media Kit</span>
          </h1>

          {/* Image - Large and Centered */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-2xl">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <Image
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  alt="Chris Gray"
                  src={profilePic}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xl text-foreground leading-relaxed">
              If you're here, you're probably looking for a podcast guest, a
              speaker for your virtual or in person event, or a value packed
              training for your membership. We genuinely appreciate your visit!
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mb-12">
            <a
              href="https://www.dropbox.com/scl/fi/2i02qu2cyhwmuc8qalngv/profilepic1.heic?rlkey=iulrx5k1thhogn82snwo1h9vc&e=1&st=sxofyytb&dl=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="px-8 py-4 rounded-lg font-semibold flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition text-lg">
                <Download className="w-5 h-5" />
                Download Profile Image
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-foreground">
            About Chris
          </h2>
          <div className="space-y-6 text-foreground">
            <p className="text-lg leading-relaxed">
              Chris Gray is the co-owner of{" "}
              <span className="font-semibold">Red Palm Studios</span>, a
              forward-thinking marketing agency dedicated to serving big brands
              and small businesses within the trades industry. An entrepreneur
              at heart, Chris turned a personal passion into a thriving business
              with <span className="font-semibold">Bald Buck Seasoning</span>.
            </p>
            <p className="text-lg leading-relaxed">
              He continues to innovate through the{" "}
              <span className="font-semibold">Bald Buck Newsletter</span>, a
              go-to resource for senior citizens seeking relevant updates on
              topics that matter most to them. As the founder of the{" "}
              <span className="font-semibold">EARN CORE COMMUNITY</span>, Chris
              has brought together over 4,000 entrepreneurs, fostering
              collaboration and learning in a vibrant network. In addition,
              Chris is co-host of the{" "}
              <span className="font-semibold">Big Life Podcast</span>, where he
              and Dmitri Smirnoff interview successful entrepreneurs.
            </p>
            <p className="text-lg leading-relaxed">
              Away from the work, Chris is a devoted husband and father, a
              committed Brazilian jiu-jitsu practitioner, and an "undercover
              geek." Whether he's helping clients elevate their brand,
              perfecting a new seasoning blend, or sharpening his mediocre Jiu
              Jitsu skills, Chris brings unbridled passion and determination to
              every facet of his life.
            </p>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Discussion Topics Include But Are Not Limited To:
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {topics.map((topic, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary">{topic.icon}</div>
                  <span className="text-lg font-semibold text-foreground">
                    {topic.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Topics */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Plus These Topics & More
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Lead Generation",
                "Family",
                "Newsletters",
                "Digital Marketing",
                "Social Media",
                "Email Marketing",
                "Paid Advertising",
                "Community Building",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-foreground">
            What Does Chris Want From You
          </h2>
          <div className="space-y-8">
            <div className="p-8 rounded-lg border border-border bg-background">
              <p className="text-lg text-foreground leading-relaxed mb-6">
                Chris wants to add value to your followers by having an
                authentic yet tactical conversation with you. The goal is for
                your followers to walk away with a tip they can implement today.
                Chris will then post any assets you give on his social media and
                to his community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-primary-foreground">
            Ready to Collaborate?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground">
            For any further questions, please contact us
          </p>
          <a href="mailto:Marisol@redpalm.us">
            <button className="px-8 py-4 rounded-lg font-semibold text-lg bg-primary-foreground text-primary hover:opacity-90 transition">
              Get in Touch
            </button>
          </a>
          <p className="mt-6 text-primary-foreground">
            Email:{" "}
            <a
              href="mailto:Marisol@redpalm.us"
              className="underline hover:opacity-80"
            >
              Marisol@redpalm.us
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} EARN CORE COMMUNITY. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
