import { type Exercise, GoalType, TrainingLevel } from "@prisma/client";
import { generateNutritionPlan } from "@/lib/logic/nutrition-generator";
import {
  generateWorkoutSplit,
  isExerciseAllowed,
  prescriptionForLevel,
} from "@/lib/logic/workout-generator";
import { milestoneTemplates } from "@/lib/logic/milestones";

export type PlanGenerationInput = {
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  heightCm: number;
  weightKg: number;
  goalType: GoalType;
  trainingLevel: TrainingLevel;
  workoutsPerWeek: number;
  equipmentType:
    | "FULL_GYM"
    | "HOME_GYM"
    | "DUMBBELLS_ONLY"
    | "BODYWEIGHT_ONLY"
    | "MINIMAL"
    | "CUSTOM";
  injuries: string[];
  exercisesToAvoid: string[];
  timelineWeeks: number;
  activityLevel?: string;
};

export function buildPlan(input: PlanGenerationInput, exercises: Exercise[]) {
  const split = generateWorkoutSplit(input.workoutsPerWeek, input.goalType);
  const nutrition = generateNutritionPlan({
    age: input.age,
    sex: input.sex,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    goalType: input.goalType,
    trainingLevel: input.trainingLevel,
    activityLevel: input.activityLevel,
  });

  const filtered = exercises.filter((ex) =>
    isExerciseAllowed(ex, {
      goalType: input.goalType,
      trainingLevel: input.trainingLevel,
      workoutsPerWeek: input.workoutsPerWeek,
      equipmentType: input.equipmentType,
      injuries: input.injuries,
      exercisesToAvoid: input.exercisesToAvoid,
    }),
  );

  const p = prescriptionForLevel(input.trainingLevel);

  const workout = split.map((focus, index) => ({
    day: index + 1,
    focus,
    exercises: filtered.slice(index, index + 4).map((e) => ({
      name: e.name,
      sets: p.sets,
      reps: p.reps,
      restSeconds: p.restSeconds,
      progressionRule: p.progressionRule,
      tempo: e.tempoRecommendation ?? "2-0-2 controlled",
    })),
  }));

  return {
    workout,
    nutrition,
    milestones: milestoneTemplates(input.goalType, input.timelineWeeks),
    explainability: {
      workoutRule: "split based on goal and available weekly sessions",
      nutritionRule: "BMR/TDEE estimate with conservative goal modifier",
      adaptationLayer: "rules-based; AI-ready extension point",
    },
  };
}
