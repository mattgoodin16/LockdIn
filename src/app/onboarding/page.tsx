"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  "Basic",
  "Goals",
  "Training",
  "Limitations",
  "Nutrition",
  "Motivation",
  "Privacy",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  return (
    <main className="min-h-screen bg-[#0A1018] px-4 py-8 text-zinc-100">
      <Card className="mx-auto max-w-3xl border-white/10 bg-white/5">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Onboarding</p>
          <CardTitle className="text-2xl">Build Your LockdIn System</CardTitle>
          <p className="text-sm text-zinc-400">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {step === 0 ? <BasicStep /> : null}
            {step === 1 ? <GoalStep /> : null}
            {step === 2 ? <TrainingStep /> : null}
            {step === 3 ? <LimitationsStep /> : null}
            {step === 4 ? <NutritionStep /> : null}
            {step === 5 ? <MotivationStep /> : null}
            {step === 6 ? <PrivacyStep /> : null}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" className="border-white/20 bg-transparent" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} className="bg-cyan-300 text-zinc-900 hover:bg-cyan-200">
                Continue
              </Button>
            ) : (
              <Button onClick={() => router.push("/home")} className="bg-cyan-300 text-zinc-900 hover:bg-cyan-200">
                Complete Onboarding
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function BasicStep() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Age"><Input type="number" /></Field>
      <Field label="Sex">
        <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>
          <SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem>
        </SelectContent></Select>
      </Field>
      <Field label="Height (cm)"><Input type="number" /></Field>
      <Field label="Weight (kg)"><Input type="number" /></Field>
    </div>
  );
}

function GoalStep() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Goal"><Select><SelectTrigger><SelectValue placeholder="Select goal" /></SelectTrigger><SelectContent>
        <SelectItem value="fat-loss">Fat loss</SelectItem><SelectItem value="muscle-gain">Muscle gain</SelectItem><SelectItem value="strength">Strength</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="general">General fitness</SelectItem>
      </SelectContent></Select></Field>
      <Field label="Target Timeline (weeks)"><Input type="number" defaultValue={16} /></Field>
      <Field label="Body Areas to Prioritize"><Input placeholder="Core, glutes, back" /></Field>
      <Field label="Preferred Workout Style"><Input placeholder="Strength-focused hypertrophy" /></Field>
      <Field label="Goal Intensity / Seriousness"><Input type="range" min={1} max={10} defaultValue={7} /></Field>
    </div>
  );
}

function TrainingStep() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Training Experience"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="advanced">Advanced</SelectItem></SelectContent></Select></Field>
      <Field label="Workouts per Week"><Input type="number" defaultValue={4} /></Field>
      <Field label="Session Length (min)"><Input type="number" defaultValue={50} /></Field>
      <Field label="Equipment"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="full">Full gym</SelectItem><SelectItem value="home">Home gym</SelectItem><SelectItem value="db">Dumbbells only</SelectItem><SelectItem value="bw">Bodyweight only</SelectItem><SelectItem value="minimal">Minimal</SelectItem></SelectContent></Select></Field>
      <Field label="Activity Level"><Input placeholder="Desk job, 8k steps/day" /></Field>
      <Field label="Current Consistency"><Input placeholder="3 workouts/week for 2 months" /></Field>
    </div>
  );
}

function LimitationsStep() {
  return (
    <div className="space-y-4">
      <Field label="Injuries"><Textarea placeholder="Any current injury concerns" /></Field>
      <Field label="Mobility Limitations"><Textarea placeholder="Ankle mobility, overhead restrictions, etc." /></Field>
      <Field label="Exercises to Avoid"><Textarea placeholder="Dips, heavy back squat, etc." /></Field>
      <Field label="Recovery Concerns"><Textarea placeholder="Sleep, stress, fatigue patterns" /></Field>
    </div>
  );
}

function NutritionStep() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Dietary Preference"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="omnivore">Omnivore</SelectItem><SelectItem value="vegetarian">Vegetarian</SelectItem><SelectItem value="vegan">Vegan</SelectItem><SelectItem value="pescatarian">Pescatarian</SelectItem></SelectContent></Select></Field>
      <Field label="Meal Frequency"><Input type="number" defaultValue={3} /></Field>
      <Field label="Food Dislikes"><Textarea placeholder="Mushrooms, shellfish, etc." /></Field>
      <Field label="Allergies / Restrictions"><Textarea placeholder="Peanuts, gluten, lactose" /></Field>
      <Field label="Calorie Preference (optional)"><Input type="number" placeholder="e.g. 2300" /></Field>
    </div>
  );
}

function MotivationStep() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Motivational Tone"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="aggressive">Aggressive</SelectItem><SelectItem value="encouraging">Encouraging</SelectItem><SelectItem value="disciplined">Disciplined</SelectItem><SelectItem value="coach">Coach-like</SelectItem><SelectItem value="minimal">Minimal</SelectItem></SelectContent></Select></Field>
      <Field label="Notification Time"><Input type="time" defaultValue="07:30" /></Field>
      <Field label="Reminder Categories"><Input placeholder="Workout, meals, check-ins, milestones" /></Field>
    </div>
  );
}

function PrivacyStep() {
  return (
    <div className="space-y-4">
      <Field label="Profile Visibility"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent></Select></Field>
      <Field label="Can friends view consistency data?"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></Field>
      <Field label="Share weekly recap by default?"><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></Field>
      <p className="text-xs text-zinc-400">This platform is not medical advice. For pain or injury, consult a qualified professional.</p>
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
