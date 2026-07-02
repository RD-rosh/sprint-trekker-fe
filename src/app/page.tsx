import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 lg:px-10">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white">ST</span>
              Built for modern product teams that ship faster.
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
                  <Image src="/icon.svg" alt="SprintTrekker" width={32} height={32} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">SprintTrekker</p>
                  <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                    Product-driven sprint planning made beautiful.
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-base leading-8 text-zinc-500 sm:text-lg">
                Align your engineering, design, and product teams with agile workflows, clear ownership, and fast feedback loops — all inside a polished, modern workspace.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Get started
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-white/20 hover:bg-card"
              >
                See features
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-border bg-card/80 p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Team capacity</p>
                  <h2 className="text-2xl font-semibold text-foreground">Launch next sprint in minutes</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Live</span>
              </div>

              <div className="grid gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-zinc-900/90 p-4 text-sm text-zinc-200">
                  <span>Design review</span>
                  <span className="font-semibold text-white">On track</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-zinc-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Progress</p>
                    <p className="mt-2 text-xl font-semibold text-white">72%</p>
                  </div>
                  <div className="rounded-3xl bg-zinc-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Risks</p>
                    <p className="mt-2 text-xl font-semibold text-white">4 blockers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: 'Unified backlog',
              description: 'Connect stories, tasks, and bugs in one product workspace so every sprint is aligned to outcomes.',
              icon: '📌',
            },
            {
              title: 'Fast planning',
              description: 'Create sprints, assign owners, and prioritize work quickly with intuitive board and list views.',
              icon: '⚡',
            },
            {
              title: 'Team collaboration',
              description: 'Invite teammates, share updates, and keep everyone aligned in a workspace built for product teams.',
              icon: '🤝',
            },
          ].map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm shadow-black/5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-500">{feature.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
