export type AdherenceInputs = {
  workoutsPlanned: number;
  workoutsCompleted: number;
  nutritionAdherenceAvg: number;
  checkInCompletionRate: number;
  recoveryInputRate: number;
  streakDays: number;
};

export function calculateAdherenceScore(input: AdherenceInputs) {
  const workoutRate = input.workoutsPlanned
    ? (input.workoutsCompleted / input.workoutsPlanned) * 100
    : 0;
  const streakBonus = Math.min(input.streakDays * 1.2, 12);

  const score = Math.round(
    workoutRate * 0.35 +
      input.nutritionAdherenceAvg * 0.25 +
      input.checkInCompletionRate * 0.15 +
      input.recoveryInputRate * 0.15 +
      streakBonus,
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    workoutRate: Math.round(workoutRate),
  };
}
