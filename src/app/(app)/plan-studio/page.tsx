import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const split = [
  { day: "Mon", focus: "Upper Strength", exercises: ["DB Bench Press", "Chest-Supported Row", "Overhead Press", "Lat Pulldown"] },
  { day: "Tue", focus: "Lower Strength", exercises: ["Goblet Squat", "Romanian Deadlift", "Split Squat", "Calf Raise"] },
  { day: "Thu", focus: "Push Hypertrophy", exercises: ["Incline DB Press", "Landmine Press", "Lateral Raise", "Triceps Pressdown"] },
  { day: "Sat", focus: "Pull + Posterior", exercises: ["1-Arm DB Row", "Hip Hinge Pattern", "Rear Delt Fly", "Hammer Curl"] },
];

export default function PlanStudioPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Plan Studio</h1>
      <p className="text-sm text-zinc-400">Adaptive coaching plan with progression and substitutions.</p>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Adaptive Change Log</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="rounded-lg border border-white/10 p-3">
            <p className="font-medium">Calorie adjustment + simplified volume</p>
            <p className="text-zinc-400">Why: high adherence, flat weight trend, slight recovery dip.</p>
            <p className="text-zinc-300">Next: keep load stable this week and hit all planned sessions.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {split.map((d) => (
          <Card key={d.day} className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{d.day} · {d.focus}</span>
                <Badge className="bg-cyan-300/20 text-cyan-200">4 sets · 8-12 reps</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-zinc-300">
                {d.exercises.map((ex) => (
                  <li key={ex} className="rounded-md border border-white/10 p-2">
                    {ex}
                    <p className="text-xs text-zinc-500">Substitution ready if equipment/pain flags change.</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
