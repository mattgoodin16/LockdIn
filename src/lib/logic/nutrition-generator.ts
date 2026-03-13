import { GoalType, TrainingLevel } from "@prisma/client";

type NutritionInput = {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  goalType: GoalType;
  trainingLevel: TrainingLevel;
  activityLevel?: string;
};

function estimateBmr(i: NutritionInput) {
  const base = 10 * i.weightKg + 6.25 * i.heightCm - 5 * i.age;
  if (i.sex === "MALE") return base + 5;
  if (i.sex === "FEMALE") return base - 161;
  return base - 80;
}

function activityMultiplier(level?: string) {
  switch (level) {
    case "very-active":
      return 1.7;
    case "active":
      return 1.55;
    case "light":
      return 1.4;
    default:
      return 1.3;
  }
}

export function generateNutritionPlan(input: NutritionInput) {
  const tdee = estimateBmr(input) * activityMultiplier(input.activityLevel);
  let calories = tdee;

  if (input.goalType === "FAT_LOSS") calories -= 300;
  if (input.goalType === "MUSCLE_GAIN") calories += 220;
  if (input.goalType === "STRENGTH") calories += 120;

  const proteinPerKg =
    input.goalType === "MUSCLE_GAIN" || input.goalType === "STRENGTH" ? 2 : 1.8;
  const protein = Math.round(input.weightKg * proteinPerKg);
  const fats = Math.round((calories * 0.27) / 9);
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4);

  return {
    calories: Math.round(Math.max(1400, calories)),
    proteinGrams: Math.max(90, protein),
    carbsGrams: Math.max(90, carbs),
    fatsGrams: Math.max(35, fats),
    hydrationLiters: Number((input.weightKg * 0.035).toFixed(1)),
    mealStructure: [
      "Protein-forward breakfast",
      "Balanced lunch",
      "Performance dinner",
      "Optional high-protein snack",
    ],
    preWorkoutGuidance:
      "Have 25-40g carbs and 20-35g protein 60-120 minutes pre-session.",
    postWorkoutGuidance:
      "Aim for 25-40g protein and a moderate carb serving in the next 2 hours.",
    notes: [
      "Keep weekly averages in range rather than forcing perfect single days.",
      "Adjust portions with hunger and recovery, not emotion.",
      "No extreme deficits or rapid cuts.",
    ],
  };
}
