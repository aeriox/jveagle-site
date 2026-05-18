"use client";

import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/content";
import { useSite } from "./site-provider";

export function Hero() {
  const { layout } = useSite();
  switch (layout) {
    case "centered":
      return <HeroCentered />;
    case "magazine":
      return <HeroMagazine />;
    case "bento":
      return <HeroBento />;
    case "classic":
    default:
      return <HeroClassic />;
  }
}

/* -------- Classic: text-left, image-right, floating badge -------- */
function HeroClassic() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl container-pad pt-16 pb-24 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="eyebrow mb-5">{COMPANY.promise}</p>
          <h1 className="h-display text-5xl sm:text-6xl lg:text-7xl text-fg mb-6">
            Florida's roof,
            <br />
            done right.
          </h1>
          <Lead />
          <CTARow />
          <Stats />
        </div>
        <div className="relative">
          <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-app">
            <Image
              src="/hero/services.webp"
              alt="JV Eagle roofing crew at work"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 card max-w-[240px] hidden sm:block">
            <p className="eyebrow mb-1">Licensed</p>
            <p className="text-sm font-semibold text-fg">
              Florida-licensed. The hardest state in the country to qualify in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Centered: stacked, image strip below -------- */
function HeroCentered() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-4xl container-pad pt-20 pb-12 lg:pt-28 text-center">
        <p className="eyebrow mb-6">{COMPANY.promise}</p>
        <h1 className="h-display text-5xl sm:text-7xl lg:text-8xl text-fg mb-8">
          Florida's roof,
          <br />
          done right.
        </h1>
        <p className="text-lg lg:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Owner-led. In-house crews only. Fully licensed and insured across the state. From a leaking
          shingle to a 40,000 sq ft commercial TPO install — we handle it without subcontractors.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Link href="/contact" className="btn btn-accent">
            Get a Free Inspection
          </Link>
          <a href={COMPANY.phoneHref} className="btn btn-outline">
            Call {COMPANY.phone}
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl container-pad pb-16">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-app">
          <Image
            src="/hero/services.webp"
            alt="JV Eagle roofing crew at work"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="mt-10 flex flex-wrap gap-10 justify-center text-sm text-muted">
          <Stat label="In-house crews" value="100%" />
          <Stat label="Licensed states" value="FL" />
          <Stat label="Average install" value="1–3 days" />
        </div>
      </div>
    </section>
  );
}

/* -------- Magazine: full-bleed image with text overlay -------- */
function HeroMagazine() {
  return (
    <section className="relative">
      <div className="relative w-full h-[88vh] min-h-[640px] overflow-hidden">
        <Image
          src="/hero/services.webp"
          alt="JV Eagle roofing crew at work"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl container-pad w-full">
            <div className="max-w-2xl text-white">
              <p
                className="eyebrow mb-6"
                style={{ color: "var(--accent)" }}
              >
                {COMPANY.promise}
              </p>
              <h1 className="h-display text-5xl sm:text-7xl lg:text-8xl text-white mb-6">
                Florida's roof,
                <br />
                done right.
              </h1>
              <p className="text-lg lg:text-xl text-white/85 max-w-xl mb-8 leading-relaxed">
                Owner-led. In-house crews only. Fully licensed and insured across the state. From a
                leaking shingle to a 40,000 sq ft commercial TPO install — we handle it without
                subcontractors.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-accent">
                  Get a Free Inspection
                </Link>
                <a
                  href={COMPANY.phoneHref}
                  className="btn"
                  style={{
                    background: "transparent",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  Call {COMPANY.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 hidden lg:flex gap-8 text-white">
          <Stat label="In-house crews" value="100%" white />
          <Stat label="Licensed" value="FL" white />
          <Stat label="Install time" value="1–3 days" white />
        </div>
      </div>
    </section>
  );
}

/* -------- Bento: asymmetric grid of tiles -------- */
function HeroBento() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl container-pad pt-12 pb-20 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-[auto_auto] gap-4">
          {/* Big text tile */}
          <div className="lg:col-span-4 card flex flex-col justify-end min-h-[420px] lg:min-h-[520px] !p-8 lg:!p-12">
            <p className="eyebrow mb-6">{COMPANY.promise}</p>
            <h1 className="h-display text-5xl sm:text-6xl lg:text-7xl text-fg mb-6">
              Florida's roof,
              <br />
              done right.
            </h1>
            <Lead />
            <CTARow />
          </div>

          {/* Image tile (tall) */}
          <div className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-[var(--radius-card)] min-h-[300px]">
            <Image
              src="/hero/services.webp"
              alt="JV Eagle roofing crew at work"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>

          {/* Stat tiles row */}
          <div className="card flex flex-col justify-center !p-6 lg:col-span-1">
            <p className="eyebrow mb-2">Crews</p>
            <p className="h-display text-4xl text-fg">100%</p>
            <p className="text-xs text-muted mt-1">In-house</p>
          </div>
          <div className="card flex flex-col justify-center !p-6 lg:col-span-1">
            <p className="eyebrow mb-2">Licensed</p>
            <p className="h-display text-4xl text-fg">FL</p>
            <p className="text-xs text-muted mt-1">Hardest state</p>
          </div>
          <div className="card bg-primary flex flex-col justify-center !p-6 lg:col-span-2">
            <p className="eyebrow mb-2" style={{ color: "var(--accent)" }}>
              Average install
            </p>
            <p className="h-display text-4xl">1–3 days</p>
            <p className="text-xs opacity-80 mt-1">Most residential replacements</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- Shared bits -------- */
function Lead() {
  return (
    <p className="text-lg lg:text-xl text-muted max-w-xl mb-8 leading-relaxed">
      Owner-led. In-house crews only. Fully licensed and insured across the state. From a leaking
      shingle to a 40,000 sq ft commercial TPO install — we handle it without subcontractors.
    </p>
  );
}

function CTARow() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/contact" className="btn btn-accent">
        Get a Free Inspection
      </Link>
      <a href={COMPANY.phoneHref} className="btn btn-outline">
        Call {COMPANY.phone}
      </a>
    </div>
  );
}

function Stats() {
  return (
    <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted">
      <Stat label="In-house crews" value="100%" />
      <Stat label="Licensed states" value="FL" />
      <Stat label="Average install" value="1–3 days" />
    </div>
  );
}

function Stat({ label, value, white }: { label: string; value: string; white?: boolean }) {
  return (
    <div>
      <p className={`text-2xl font-extrabold ${white ? "text-white" : "text-fg"}`}>{value}</p>
      <p className={`text-xs uppercase tracking-wider ${white ? "text-white/70" : "text-muted"}`}>
        {label}
      </p>
    </div>
  );
}
