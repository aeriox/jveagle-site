import Link from "next/link";
import { COMPANY, REVIEWS } from "@/lib/content";

export const metadata = { title: `Reviews — ${COMPANY.name}` };

export default function ReviewsPage() {
  return (
    <>
      <section className="section">
        <div className="mx-auto max-w-7xl container-pad">
          <p className="eyebrow mb-4">Reviews</p>
          <h1 className="h-display text-5xl lg:text-6xl text-fg max-w-3xl mb-6">
            What Florida homeowners say.
          </h1>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            Every review below comes from a real customer. We earn our reputation one roof at a time.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-app">
        <div className="mx-auto max-w-7xl container-pad py-16 grid md:grid-cols-2 gap-6">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} className="card">
              <div className="flex gap-1 mb-4 text-accent">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
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
      </section>

      <section className="section">
        <div className="mx-auto max-w-3xl container-pad text-center">
          <h2 className="h-display text-3xl lg:text-4xl text-fg mb-4">Worked with us recently?</h2>
          <p className="text-muted mb-8">
            Reviews mean everything to a contractor. If we did right by you, please tell us — and tell
            your neighbors.
          </p>
          <Link href="/contact" className="btn btn-accent">
            Leave a Review
          </Link>
        </div>
      </section>
    </>
  );
}
