import {
  EquipmentType,
  GoalType,
  TrainingLevel,
  type Exercise,
} from "@prisma/client";

type WorkoutInput = {
  goalType: GoalType;
  trainingLevel: TrainingLevel;
  workoutsPerWeek: number;
  equipmentType: EquipmentType;
  injuries: string[];
  exercisesToAvoid: string[];
};

const setByLevel: Record<TrainingLevel, number> = {
  BEGINNER: 3,
  INTERMEDIATE: 4,
  ADVANCED: 5,
};

export function generateWorkoutSplit(days: number, goalType: GoalType) {
  if (days <= 3)
    return ["Full Body A", "Full Body B", "Full Body C"].slice(0, days);
  if (goalType === "STRENGTH")
    return [
      "Upper Strength",
      "Lower Strength",
      "Push",
      "Pull",
      "Lower Hypertrophy",
    ].slice(0, days);
  if (goalType === "MUSCLE_GAIN")
    return ["Push", "Pull", "Legs", "Upper", "Lower"].slice(0, days);
  return ["Upper", "Lower", "Upper", "Lower", "Conditioning"].slice(0, days);
}

export function isExerciseAllowed(ex: Exercise, input: WorkoutInput) {
  const avoidByInjury = ex.injuryFlags.some((flag) => input.injuries.includes(flag));
  const avoidByName = input.exercisesToAvoid.some((item) =>
    ex.name.toLowerCase().includes(item.toLowerCase()),
  );

  const equipmentGate =
    input.equipmentType === "FULL_GYM" ||
    ex.equipment.includes("ANY") ||
    ex.equipment.includes(input.equipmentType);

  return !avoidByInjury && !avoidByName && equipmentGate;
}

export function prescriptionForLevel(level: TrainingLevel) {
  const sets = setByLevel[level];
  return {
    sets,
    reps: level === "ADVANCED" ? "6-10" : "8-12",
    restSeconds: level === "ADVANCED" ? 120 : 90,
    progressionRule:
      "When all top sets hit rep ceiling with good form for two sessions, increase load 2.5-5%.",
  };
}
