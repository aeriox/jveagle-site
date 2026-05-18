import type { Metadata } from "next";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Picker } from "@/components/picker";
import { COMPANY } from "@/lib/content";
import { inter, playfair, jetbrains, dmSans } from "./fonts";

export const metadata: Metadata = {
  title: `${COMPANY.name} — ${COMPANY.tagline}`,
  description: `${COMPANY.promise} Licensed Florida roofing contractor offering residential and commercial roofing, repairs, and waterproofing across all of Florida.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="navy-gold"
      data-typography="modern-sans"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <SiteProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <Picker />
        </SiteProvider>
      </body>
    </html>
  );
}
