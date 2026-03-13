import { NextRequest, NextResponse } from "next/server";
import { GoalType } from "@prisma/client";
import { generateAdaptations } from "@/lib/logic/adaptation";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const changes = generateAdaptations({
    goalType: (body.goalType ?? "GENERAL_FITNESS") as GoalType,
    adherenceScore: Number(body.adherenceScore ?? 70),
    workoutCompletionRate: Number(body.workoutCompletionRate ?? 70),
    weightTrendDelta: Number(body.weightTrendDelta ?? 0),
    strengthTrendDelta: Number(body.strengthTrendDelta ?? 0),
    poorRecovery: Boolean(body.poorRecovery),
    painFlag: Boolean(body.painFlag),
  });

  return NextResponse.json({ changedAt: new Date().toISOString(), changes });
}
