import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendChart } from "@/components/charts/trend-chart";
import { trendData } from "@/lib/data/mock";

export default function ProgressVaultPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Progress Vault</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/5"><CardHeader><CardTitle>Weight Trend</CardTitle></CardHeader><CardContent><TrendChart data={trendData} dataKey="weight" color="#59def6" /></CardContent></Card>
        <Card className="border-white/10 bg-white/5"><CardHeader><CardTitle>Strength Trend</CardTitle></CardHeader><CardContent><TrendChart data={trendData} dataKey="strength" color="#66f0a8" /></CardContent></Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5 lg:col-span-2"><CardHeader><CardTitle>Milestone Timeline</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="rounded-lg border border-white/10 p-3">Week 4: 80% adherence lock <Badge className="ml-2 bg-cyan-300/20 text-cyan-200">Completed</Badge></p><p className="rounded-lg border border-white/10 p-3">Week 8: -3kg checkpoint <Badge className="ml-2 bg-white/10">On Track</Badge></p><p className="rounded-lg border border-white/10 p-3">Week 16: final target window <Badge className="ml-2 bg-white/10">Upcoming</Badge></p></CardContent></Card>
        <Card className="border-white/10 bg-white/5"><CardHeader><CardTitle>Progress Photos</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-zinc-300"><div className="rounded-lg border border-dashed border-white/20 p-6 text-center">Upload front / side / back</div><p>Photo history organized by date and label.</p></CardContent></Card>
      </div>
    </div>
  );
}
