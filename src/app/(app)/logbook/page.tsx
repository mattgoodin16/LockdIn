import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LogbookPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Logbook</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/5 lg:col-span-2">
          <CardHeader><CardTitle>Workout Log</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Field label="Exercise"><Input className="bg-white/5" placeholder="DB bench press" /></Field>
            <Field label="Sets/Reps/Load"><Input className="bg-white/5" placeholder="4x8 @ 70 lb" /></Field>
            <Field label="Difficulty (1-10)"><Input type="number" min={1} max={10} className="bg-white/5" /></Field>
            <Field label="Skipped reason"><Input className="bg-white/5" placeholder="Shoulder discomfort" /></Field>
            <div className="md:col-span-2"><Field label="Notes"><Textarea className="bg-white/5" /></Field></div>
            <Button className="bg-cyan-300 text-zinc-900 hover:bg-cyan-200 md:col-span-2">Save Workout Log</Button>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardHeader><CardTitle>Body/Nutrition Log</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Body Weight"><Input type="number" className="bg-white/5" /></Field>
            <Field label="Waist"><Input type="number" className="bg-white/5" /></Field>
            <Field label="Macro Adherence %"><Input type="number" className="bg-white/5" /></Field>
            <Field label="Water Intake L"><Input type="number" step="0.1" className="bg-white/5" /></Field>
            <Button className="w-full bg-cyan-300 text-zinc-900 hover:bg-cyan-200">Save Daily Log</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
