import { GoalType } from "@prisma/client";

type AdaptInput = {
  goalType: GoalType;
  adherenceScore: number;
  workoutCompletionRate: number;
  weightTrendDelta: number;
  strengthTrendDelta: number;
  poorRecovery: boolean;
  painFlag: boolean;
};

export function generateAdaptations(input: AdaptInput) {
  const changes: Array<{ title: string; reason: string; action: string }> = [];

  if (input.painFlag) {
    changes.push({
      title: "Pain-aware substitutions enabled",
      reason: "Check-in reported pain with one or more exercises.",
      action:
        "Replace aggravating movements with joint-friendly alternatives and reduce loading for 1 week.",
    });
  }

  if (input.adherenceScore < 60 || input.workoutCompletionRate < 65) {
    changes.push({
      title: "Friction reduction",
      reason: "Completion and adherence trends are below target.",
      action:
        "Reduce per-session volume by ~20% and shorten sessions to improve consistency.",
    });
  }

  if (
    input.goalType === "FAT_LOSS" &&
    input.weightTrendDelta >= -0.1 &&
    input.adherenceScore >= 75 &&
    !input.poorRecovery
  ) {
    changes.push({
      title: "Calorie adjustment",
      reason: "Weight trend is flatter than expected despite solid adherence.",
      action:
        "Lower daily calories by 120-180 and increase step target by 1,000/day.",
    });
  }

  if (
    (input.goalType === "MUSCLE_GAIN" || input.goalType === "STRENGTH") &&
    input.strengthTrendDelta > 0 &&
    input.weightTrendDelta <= 0.05 &&
    !input.poorRecovery
  ) {
    changes.push({
      title: "Performance fuel increase",
      reason: "Strength is improving while body mass is flat.",
      action:
        "Increase daily calories by 100-150 with carbs centered around training windows.",
    });
  }

  if (input.poorRecovery) {
    changes.push({
      title: "Recovery guardrails",
      reason: "Sleep and recovery inputs are low.",
      action:
        "Hold progression this cycle, keep load stable, and prioritize sleep/hydration targets.",
    });
  }

  if (changes.length === 0) {
    changes.push({
      title: "Steady progression",
      reason: "Current trends support continuation.",
      action:
        "Maintain plan structure and progress load gradually within rep targets.",
    });
  }

  return changes;
}
