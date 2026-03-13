import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConsistencyCalendar } from "@/components/charts/consistency-calendar";
import { consistencyCalendar, friendSnapshot } from "@/lib/data/mock";

export default function SocialCirclePage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Circle</h1>
      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Friends & Accountability</CardTitle>
          <Button variant="outline" className="border-white/20 bg-transparent">Add Friend</Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {friendSnapshot.map((f) => (
            <div key={f.name} className="rounded-lg border border-white/10 p-3 text-sm text-zinc-300">
              <p className="font-medium text-zinc-100">{f.name}</p>
              <p>Streak: {f.streak} days</p>
              <p>Adherence: {f.adherence}%</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Consistency Calendar</CardTitle></CardHeader>
        <CardContent><ConsistencyCalendar data={consistencyCalendar} /></CardContent>
      </Card>
      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Weekly Recap Share Card</CardTitle></CardHeader>
        <CardContent className="rounded-xl border border-white/10 p-4 text-sm text-zinc-300">
          Workouts: 4/4 · Adherence: 87% · Streak: 19 days · Next focus: sleep consistency.
        </CardContent>
      </Card>
    </div>
  );
}
