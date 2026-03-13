import { NextRequest, NextResponse } from "next/server";
import { GoalType, TrainingLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildPlan } from "@/lib/logic/plan-engine";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const exercises = await prisma.exercise.findMany();

  const result = buildPlan(
    {
      age: Number(body.age ?? 30),
      sex: body.sex ?? "MALE",
      heightCm: Number(body.heightCm ?? 178),
      weightKg: Number(body.weightKg ?? 85),
      goalType: (body.goalType ?? "GENERAL_FITNESS") as GoalType,
      trainingLevel: (body.trainingLevel ?? "BEGINNER") as TrainingLevel,
      workoutsPerWeek: Number(body.workoutsPerWeek ?? 4),
      equipmentType: body.equipmentType ?? "MINIMAL",
      injuries: body.injuries ?? [],
      exercisesToAvoid: body.exercisesToAvoid ?? [],
      timelineWeeks: Number(body.timelineWeeks ?? 12),
      activityLevel: body.activityLevel,
    },
    exercises,
  );

  return NextResponse.json(result);
}
