import Link from "next/link";
import { APP_NAME, APP_TAGLINE, DISCLAIMER } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(82,226,255,0.2),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(40,135,255,0.16),transparent_35%),linear-gradient(180deg,#070B13_0%,#0D1522_100%)] px-4 py-16 text-zinc-100">
      <section className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm uppercase tracking-[0.22em] text-cyan-300">Elite Coaching Platform</p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {APP_NAME}
          <span className="block text-zinc-300">{APP_TAGLINE}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-zinc-300">
          Personalized workout and nutrition plans, adaptive check-ins, progress vault analytics, consistency scoring, and accountability circles in one premium system.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup">
            <Button className="bg-cyan-300 text-zinc-950 hover:bg-cyan-200">Create Account</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-white/20 bg-transparent text-zinc-100 hover:bg-white/10">
              Log In
            </Button>
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            "Adaptive Plan Studio",
            "Nutrition Lab + Grocery Engine",
            "Progress Vault + Social Accountability",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="font-medium">{item}</h3>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs text-zinc-400">{DISCLAIMER}</p>
      </section>
    </main>
  );
}
