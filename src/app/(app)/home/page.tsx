import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/sections/stat-card";
import { friendSnapshot, trendData } from "@/lib/data/mock";
import { TrendChart } from "@/components/charts/trend-chart";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-2xl font-semibold">Command Center</h1>
        <p className="text-sm text-zinc-400">Today’s training, nutrition, adherence, and accountability pulse.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today Workout" value="Lower Strength" subtitle="45 min with progression" />
        <StatCard title="Nutrition Target" value="2,280 kcal" subtitle="P 185 / C 240 / F 72" />
        <StatCard title="Streak" value="19 days" subtitle="+4 vs last month" />
        <StatCard title="Adherence Score" value="87%" subtitle="High compliance zone" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Body Metric Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} dataKey="weight" color="#59def6" />
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle>Milestone & Reminders</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>Next milestone: <span className="font-medium text-zinc-100">10 lb total reduction</span> in 5 weeks.</p>
            <Badge className="bg-cyan-300/20 text-cyan-200">Check-in due in 2 days</Badge>
            <p className="rounded-lg border border-white/10 p-3 text-zinc-300">&ldquo;Discipline compounds. Hit today&apos;s session, log tonight&apos;s adherence.&rdquo;</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {friendSnapshot.map((f) => (
          <Card key={f.name} className="border-white/10 bg-white/5">
            <CardHeader className="pb-2"><CardTitle className="text-base">{f.name}</CardTitle></CardHeader>
            <CardContent className="text-sm text-zinc-300">
              <p>Streak: {f.streak} days</p>
              <p>Adherence: {f.adherence}%</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
