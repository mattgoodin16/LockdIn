import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    workoutsCompleted: 4,
    workoutsPlanned: 4,
    adherenceScore: 87,
    streak: 19,
    bodyMetricTrend: "Weight and waist trending down steadily.",
    milestoneProgress: "Week 8 checkpoint on track.",
    topAchievement: "Completed all lower-body sessions with progression.",
    nextFocus: "Lock in sleep consistency and hydration.",
  });
}
