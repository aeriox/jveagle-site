import { COMPANY, ALL_SERVICES } from "@/lib/content";

export const metadata = { title: `Contact — ${COMPANY.name}` };

export default function ContactPage() {
  return (
    <section className="section">
      <div className="mx-auto max-w-7xl container-pad grid lg:grid-cols-2 gap-12">
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="h-display text-5xl lg:text-6xl text-fg mb-6">
            Free inspection.
            <br />
            One call.
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-10 max-w-md">
            Tell us about your roof. We'll come out, climb up, and give you an honest report —
            usually within 24–48 hours.
          </p>

          <ul className="space-y-5">
            <Detail label="Phone" value={COMPANY.phone} href={COMPANY.phoneHref} />
            <Detail label="Email" value={COMPANY.email} href={COMPANY.emailHref} />
            <Detail label="Office" value={COMPANY.address} />
            <Detail label="Service area" value={COMPANY.serviceArea} />
          </ul>
        </div>

        <form
          action={COMPANY.emailHref}
          method="post"
          className="card space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-fg mb-2" htmlFor="name">
              Name
            </label>
            <input
              required
              id="name"
              name="name"
              className="w-full rounded-md border border-app bg-app px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-fg mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                required
                id="phone"
                name="phone"
                type="tel"
                className="w-full rounded-md border border-app bg-app px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-fg mb-2" htmlFor="email">
                Email
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-app bg-app px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-fg mb-2" htmlFor="service">
              What can we help with?
            </label>
            <select
              id="service"
              name="service"
              className="w-full rounded-md border border-app bg-app px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option>Free inspection</option>
              {ALL_SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-fg mb-2" htmlFor="message">
              Tell us about your roof
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full rounded-md border border-app bg-app px-4 py-3 text-fg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" className="btn btn-accent w-full">
            Request My Free Inspection
          </button>
          <p className="text-xs text-muted text-center">
            By submitting, you agree we can call or email you about your request.
          </p>
        </form>
      </div>
    </section>
  );
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <li>
      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">{label}</p>
      {href ? (
        <a href={href} className="text-fg font-semibold hover:text-accent text-lg break-words">
          {value}
        </a>
      ) : (
        <p className="text-fg font-semibold text-lg break-words">{value}</p>
      )}
    </li>
  );
}
