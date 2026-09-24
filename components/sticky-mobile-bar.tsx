"use client";

import { COMPANY } from "@/lib/content";

export function StickyMobileBar() {
  const phoneHref = COMPANY.phoneHref?.trim() || "";
  const phoneLabel = COMPANY.phone?.trim() || "";
  const hasPhone = Boolean(phoneHref && phoneHref.startsWith("tel:"));

  return (
    <div className="sticky-mobile-bar" aria-label="Quick contact">
      <a href="/contact" className="sticky-mobile-estimate">
        Free estimate
      </a>
      {hasPhone && (
        <a href={phoneHref} className="sticky-mobile-call">
          <span className="sticky-mobile-call-label">Call</span>
          {phoneLabel ? <span className="sticky-mobile-call-num">{phoneLabel}</span> : null}
        </a>
      )}
    </div>
  );
}
