import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CheckInHubPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Check-In Hub</h1>
      <Card className="border-white/10 bg-white/5">
        <CardHeader><CardTitle>Weekly Adaptive Check-In</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2">
            {[
              "Workout difficulty (1-10)",
              "Energy (1-10)",
              "Sleep quality (1-10)",
              "Hunger (1-10)",
              "Soreness (1-10)",
              "Stress (1-10)",
              "Confidence in plan (1-10)",
              "Motivation (1-10)",
            ].map((q) => (
              <div key={q} className="space-y-2">
                <Label>{q}</Label>
                <Input type="number" min={1} max={10} className="bg-white/5" />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <Label>Any pain trigger, intensity request, or flexibility request?</Label>
              <Textarea className="bg-white/5" placeholder="Pain flags, too hard/easy feedback, preferred adjustment" />
            </div>
            <Button className="bg-cyan-300 text-zinc-900 hover:bg-cyan-200 md:col-span-2">Submit Check-In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
