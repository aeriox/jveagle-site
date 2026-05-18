import Link from "next/link";
import Image from "next/image";
import {
  COMPANY,
  RESIDENTIAL_SERVICES,
  COMMERCIAL_SERVICES,
  DIFFERENTIATORS,
  REVIEWS,
} from "@/lib/content";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* DIFFERENTIATORS */}
      <section className="section bg-surface border-y border-app">
        <div className="mx-auto max-w-7xl container-pad">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">Why JV Eagle</p>
            <h2 className="h-display text-4xl lg:text-5xl text-fg">
              The difference is who's on your roof.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="card h-full">
                <div className="h-10 w-10 rounded-lg bg-accent mb-4 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-fg text-lg mb-2">{d.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <p className="eyebrow mb-3">Services</p>
              <h2 className="h-display text-4xl lg:text-5xl text-fg mb-6">
                Residential. Commercial. Everything in between.
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                We install, replace, repair, and waterproof every common roof system in Florida.
                One crew, one number, one accountable contractor.
              </p>
              <Link href="/services" className="btn btn-primary">
                See all services →
              </Link>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">Residential</h3>
              <ul className="space-y-4">
                {RESIDENTIAL_SERVICES.map((s) => (
                  <li key={s.name} className="border-b border-app pb-4 last:border-0">
                    <p className="font-bold text-fg mb-1">{s.name}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-accent mb-4">Commercial</h3>
              <ul className="space-y-4">
                {COMMERCIAL_SERVICES.map((s) => (
                  <li key={s.name} className="border-b border-app pb-4 last:border-0">
                    <p className="font-bold text-fg mb-1">{s.name}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="bg-surface border-y border-app">
        <div className="mx-auto max-w-7xl container-pad py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { src: "/hero/replacements.webp", title: "Roof Replacements" },
            { src: "/hero/repairs.webp", title: "Roof Repairs" },
            { src: "/hero/services.webp", title: "Storm Damage & Waterproofing" },
          ].map((item) => (
            <div key={item.title} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-lg">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">From our customers</p>
            <h2 className="h-display text-4xl lg:text-5xl text-fg">
              Honest work. Honest reviews.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {REVIEWS.slice(0, 2).map((r) => (
              <blockquote key={r.name} className="card">
                <div className="flex gap-1 mb-4 text-accent">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="text-fg text-lg leading-relaxed mb-4">"{r.body}"</p>
                <footer className="text-sm">
                  <span className="font-bold text-fg">{r.name}</span>
                  <span className="text-muted"> · {r.location}</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/reviews" className="btn btn-outline">
              Read all reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <div className="bg-primary rounded-3xl px-8 py-16 lg:px-16 lg:py-20 text-center">
            <h2 className="h-display text-4xl lg:text-5xl mb-4">
              Free inspection. No pressure.
            </h2>
            <p className="text-lg opacity-80 max-w-xl mx-auto mb-8">
              We'll come out, look at your roof, and give you an honest report. If you don't need
              a new one, we'll tell you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn btn-accent">
                Schedule My Inspection
              </Link>
              <a href={COMPANY.phoneHref} className="btn btn-outline" style={{ color: "var(--primary-fg)", borderColor: "rgba(255,255,255,0.25)" }}>
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Star() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
