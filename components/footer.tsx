import Link from "next/link";
import { COMPANY, NAV } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-app mt-24">
      <div className="mx-auto max-w-7xl container-pad py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="eyebrow mb-3">{COMPANY.promise}</p>
          <h3 className="h-display text-2xl text-fg mb-3">{COMPANY.name}</h3>
          <p className="text-muted max-w-md">
            {COMPANY.tagline}. Owner-led, in-house crews, fully licensed and insured. Serving{" "}
            {COMPANY.serviceArea}.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-fg mb-4">Sitemap</h4>
          <ul className="space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-fg mb-4">Contact</h4>
          <ul className="space-y-2 text-muted">
            <li>
              <a href={COMPANY.phoneHref} className="hover:text-accent">
                {COMPANY.phone}
              </a>
            </li>
            <li>
              <a href={COMPANY.emailHref} className="hover:text-accent break-all">
                {COMPANY.email}
              </a>
            </li>
            <li className="pt-2">{COMPANY.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-app">
        <div className="mx-auto max-w-7xl container-pad py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.</p>
          <p>Florida Licensed · Fully Insured · Permits Pulled</p>
        </div>
      </div>
    </footer>
  );
}
