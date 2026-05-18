import Image from "next/image";
import Link from "next/link";
import { COMPANY, DIFFERENTIATORS } from "@/lib/content";

export const metadata = { title: `About — ${COMPANY.name}` };

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-4">About JV Eagle</p>
            <h1 className="h-display text-5xl lg:text-6xl text-fg mb-6">
              Built on craft. Run by the owner.
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-5">
              {COMPANY.name} is led by {COMPANY.owner}, a Florida-licensed roofing contractor who
              answers his own phone. We don't sub work out. The crew on your roof works for us, has
              been trained by us, and is held accountable by us.
            </p>
            <p className="text-lg text-muted leading-relaxed mb-8">
              That's the whole pitch. It also happens to be why our installs pass inspection the first
              time, why our warranties hold up, and why our customers call us again for the next roof.
            </p>
            <Link href="/contact" className="btn btn-accent">
              Talk to Javier
            </Link>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-app">
            <Image
              src="/hero/repairs.webp"
              alt="JV Eagle crew on a Florida roof"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="section bg-surface border-y border-app">
        <div className="mx-auto max-w-7xl container-pad">
          <p className="eyebrow mb-3">Our standards</p>
          <h2 className="h-display text-4xl lg:text-5xl text-fg mb-12 max-w-2xl">
            Four promises we make on every job.
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="card">
                <h3 className="font-bold text-fg text-xl mb-2">{d.title}</h3>
                <p className="text-muted leading-relaxed">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <div className="card max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-3">Service area</p>
            <h3 className="h-display text-3xl text-fg mb-3">All of Florida</h3>
            <p className="text-muted leading-relaxed mb-6">
              Headquartered in Greenacres, Palm Beach County. We work across the entire state, from the
              Keys to the Panhandle. If you've got a Florida ZIP code, we'll come out.
            </p>
            <p className="text-sm text-muted">{COMPANY.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}
