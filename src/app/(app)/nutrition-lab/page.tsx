import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateGroceryList } from "@/lib/logic/grocery";

export default function NutritionLabPage() {
  const list = generateGroceryList({
    calories: 2280,
    proteinGrams: 185,
    dietaryPreference: "OMNIVORE",
    style: "balanced",
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Nutrition Lab</h1>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Calories", "2,280"],
          ["Protein", "185g"],
          ["Carbs", "240g"],
          ["Fats", "72g"],
        ].map(([k, v]) => (
          <Card key={k} className="border-white/10 bg-white/5"><CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-400">{k}</CardTitle></CardHeader><CardContent><p className="text-xl font-semibold">{v}</p></CardContent></Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Meal Structure + Guidance</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-300">
          <p>Hydration target: 3.2L/day</p>
          <p>Pre-workout: protein + carbs 60-120 minutes before training.</p>
          <p>Post-workout: protein-centered meal in next 2 hours.</p>
          <p>Adherence this week: 82%</p>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader className="flex-row items-center justify-between"><CardTitle>Weekly Grocery Generator</CardTitle><Button className="bg-cyan-300 text-zinc-900 hover:bg-cyan-200">Regenerate</Button></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 text-sm">
          {Object.entries(list).map(([k, items]) => (
            <div key={k}>
              <p className="mb-2 font-medium capitalize text-zinc-100">{k.replace("Items", "")}</p>
              <ul className="space-y-1 text-zinc-300">{items.map((item) => <li key={item}>• {item}</li>)}</ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
