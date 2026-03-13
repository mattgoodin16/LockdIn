import { PrismaClient, TrainingLevel, GoalType, DietaryPreference, EquipmentType, NotificationTone } from "@prisma/client";
import { hash } from "bcryptjs";
import { generateNutritionPlan } from "../src/lib/logic/nutrition-generator";
import { generateWorkoutSplit, prescriptionForLevel } from "../src/lib/logic/workout-generator";
import { milestoneTemplates } from "../src/lib/logic/milestones";
import { generateGroceryList } from "../src/lib/logic/grocery";
import { calculateAdherenceScore } from "../src/lib/logic/adherence";

const prisma = new PrismaClient();

const exerciseSeed = [
  // ... your exerciseSeed array unchanged ...
];

const substitutionPairs = [
  // ... your substitutionPairs array unchanged ...
];

async function seedExercises() {
  for (const exercise of exerciseSeed) {
    await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: exercise,
      create: exercise,
    });
  }

  for (const [fromSlug, toSlug, reason] of substitutionPairs) {
    const from = await prisma.exercise.findUniqueOrThrow({ where: { slug: fromSlug } });
    const to = await prisma.exercise.findUniqueOrThrow({ where: { slug: toSlug } });

    await prisma.exerciseSubstitution.upsert({
      where: {
        fromExerciseId_toExerciseId: {
          fromExerciseId: from.id,
          toExerciseId: to.id,
        },
      },
      update: { reason },
      create: {
        fromExerciseId: from.id,
        toExerciseId: to.id,
        reason,
      },
    });
  }
}

async function seedUser(email: string, name: string, goalType: GoalType) {
  const passwordHash = await hash("LockdinDemo123", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      age: 31,
      sex: "MALE",
      heightCm: 180,
      weightKg: 89,
      bodyAreasToPrioritize: ["core", "back"],
      preferredWorkoutStyle: "strength-hypertrophy",
      seriousnessLevel: 8,
      activityLevel: "active",
      consistencyLevel: "moderate",
      injuries: ["shoulder_pain"],
      mobilityLimitations: ["ankle_mobility"],
      exercisesToAvoid: ["upright row"],
      recoveryConcerns: ["sleep_variability"],
      dietaryPreference: DietaryPreference.OMNIVORE,
      foodDislikes: ["oysters"],
      foodAllergies: ["none"],
      mealFrequencyPreference: 3,
      caloriePreference: 2300,
      onboardingCompleted: true,
    },
  });

  const goal = await prisma.goalProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      goalType,
      timelineWeeks: 16,
      targetWeightKg: goalType === GoalType.FAT_LOSS ? 82 : null,
      targetWorkoutDaysPerWeek: 4,
      sessionLengthMinutes: 50,
      trainingLevel: TrainingLevel.INTERMEDIATE,
      equipmentType: EquipmentType.DUMBBELLS_ONLY,
      workoutsPerWeek: 4,
      notificationTimeLocal: "07:30",
    },
  });

  await prisma.privacySettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      profileVisibility: "FRIENDS_ONLY",
      discoverableProfile: true,
      showConsistencyToFriends: true,
      shareWeeklyRecapByDefault: true,
    },
  });

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      tone: NotificationTone.COACH,
      preferredTime: "07:30",
      workoutReminder: true,
      nutritionReminder: true,
      checkInReminder: true,
      milestoneReminder: true,
    },
  });

  // Nutrition, grocery, workout, adherence, progressCheckIn, logs, milestones, weekly recap
  const nutrition = generateNutritionPlan({
    weightKg: 89,
    heightCm: 180,
    age: 31,
    sex: "MALE",
    goalType,
    trainingLevel: TrainingLevel.INTERMEDIATE,
    activityLevel: "active",
  });

  const nutritionPlan = await prisma.nutritionPlan.upsert({
    where: { id: `${user.id}-nutrition` },
    update: nutrition,
    create: { id: `${user.id}-nutrition`, userId: user.id, ...nutrition },
  });

  const grocery = generateGroceryList({
    calories: nutrition.calories,
    proteinGrams: nutrition.proteinGrams,
    dietaryPreference: DietaryPreference.OMNIVORE,
    style: "balanced",
  });

  await prisma.groceryList.create({
    data: { userId: user.id, nutritionPlanId: nutritionPlan.id, style: "balanced", weekOf: new Date(), ...grocery },
  });

  const split = generateWorkoutSplit(goal.workoutsPerWeek, goal.goalType);
  const plan = await prisma.workoutPlan.create({
    data: {
      userId: user.id,
      title: "Phase 1 Foundation",
      objective: "Build consistency and progressive strength safely.",
      weekStart: new Date(),
      adaptationSummary: "Initial deterministic plan generated from intake profile.",
    },
  });

  const exercisePool = await prisma.exercise.findMany();
  const defaults = prescriptionForLevel(goal.trainingLevel);

  for (let i = 0; i < split.length; i++) {
    const day = await prisma.workoutDay.create({
      data: {
        workoutPlanId: plan.id,
        dayIndex: i + 1,
        dayLabel: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] ?? `Day ${i + 1}`,
        focus: split[i],
        warmUp: "5-8 minute general warm-up + movement prep",
        cooldown: "5 minute cooldown with nasal breathing",
      },
    });

    for (let j = 0; j < Math.min(4, exercisePool.length); j++) {
      const ex = exercisePool[(i + j) % exercisePool.length];
      await prisma.exercisePrescription.create({
        data: {
          workoutDayId: day.id,
          exerciseId: ex.id,
          orderIndex: j + 1,
          sets: defaults.sets,
          reps: defaults.reps,
          restSeconds: defaults.restSeconds,
          progressionRule: defaults.progressionRule,
          substitutionHint: "Use listed substitution if equipment/pain mismatch occurs.",
        },
      });
    }
  }

  const adherence = calculateAdherenceScore({
    workoutsPlanned: 4,
    workoutsCompleted: 4,
    nutritionAdherenceAvg: 82,
    checkInCompletionRate: 100,
    recoveryInputRate: 80,
    streakDays: 19,
  });

  // ... other logs, milestones, weekly recap unchanged ...

  return user;
}

async function seedSocial(users: { id: string }[]) {
  if (users.length < 2) return;
  for (let i = 1; i < users.length; i++) {
    await prisma.friendConnection.upsert({
      where: { senderId_receiverId: { senderId: users[0].id, receiverId: users[i].id } },
      update: { status: "ACCEPTED" },
      create: { senderId: users[0].id, receiverId: users[i].id, status: "ACCEPTED" },
    });
  }
}

async function main() {
  await seedExercises();
  const users = await Promise.all([
    seedUser("demo@lockdin.app", "Demo User", GoalType.FAT_LOSS),
    seedUser("aria@lockdin.app", "Aria", GoalType.MUSCLE_GAIN),
    seedUser("kai@lockdin.app", "Kai", GoalType.STRENGTH),
  ]);
  await seedSocial(users);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
  });
