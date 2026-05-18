import Link from "next/link";
import { COMPANY, FAQS } from "@/lib/content";

export const metadata = { title: `FAQ — ${COMPANY.name}` };

export default function FAQPage() {
  return (
    <>
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <p className="eyebrow mb-4">FAQ</p>
          <h1 className="h-display text-5xl lg:text-6xl text-fg max-w-3xl mb-6">
            Straight answers.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            If your question isn't here, call {COMPANY.phone} and ask Javier.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-app">
        <div className="mx-auto max-w-3xl container-pad py-16 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="card group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer gap-4">
                <h3 className="font-bold text-fg text-lg">{f.q}</h3>
                <span className="shrink-0 text-accent group-open:rotate-45 transition-transform">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="text-muted leading-relaxed mt-4">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-3xl container-pad text-center">
          <h2 className="h-display text-3xl lg:text-4xl text-fg mb-4">Still have a question?</h2>
          <p className="text-muted mb-8">We pick up the phone. Promise.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href={COMPANY.phoneHref} className="btn btn-accent">
              Call {COMPANY.phone}
            </a>
            <Link href="/contact" className="btn btn-outline">
              Send a Message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
