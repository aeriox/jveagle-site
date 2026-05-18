import Link from "next/link";
import {
  COMPANY,
  RESIDENTIAL_SERVICES,
  COMMERCIAL_SERVICES,
  ALL_SERVICES,
} from "@/lib/content";

export const metadata = { title: `Services — ${COMPANY.name}` };

export default function ServicesPage() {
  return (
    <>
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <p className="eyebrow mb-4">Services</p>
          <h1 className="h-display text-5xl lg:text-6xl text-fg max-w-3xl mb-6">
            Every roof system Florida throws at us.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Residential and commercial. Repair and replacement. Installation and waterproofing. We
            handle the full lifecycle of your roof with one in-house crew.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-app">
        <div className="mx-auto max-w-7xl container-pad py-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="h-display text-3xl text-fg mb-2">Residential Roofing</h2>
            <p className="text-muted mb-6">For homeowners across Florida.</p>
            <ul className="space-y-5">
              {RESIDENTIAL_SERVICES.map((s) => (
                <li key={s.name} className="card">
                  <h3 className="font-bold text-fg text-lg mb-1">{s.name}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-display text-3xl text-fg mb-2">Commercial Roofing</h2>
            <p className="text-muted mb-6">Flat, low-slope, and industrial systems.</p>
            <ul className="space-y-5">
              {COMMERCIAL_SERVICES.map((s) => (
                <li key={s.name} className="card">
                  <h3 className="font-bold text-fg text-lg mb-1">{s.name}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <p className="eyebrow mb-3">Also offering</p>
          <h2 className="h-display text-3xl lg:text-4xl text-fg mb-8">Full-service roof care</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_SERVICES.map((s) => (
              <div key={s} className="card text-center">
                <p className="font-bold text-fg">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/contact" className="btn btn-accent">
              Request a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
