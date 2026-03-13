import { PrismaPg } from "@prisma/adapter-pg";
import {
  DietaryPreference,
  EquipmentType,
  GoalType,
  NotificationTone,
  PrismaClient,
  TrainingLevel,
} from "@prisma/client";
import { Pool } from "pg";
import { hash } from "bcryptjs";
import { generateNutritionPlan } from "../src/lib/logic/nutrition-generator";
import { generateWorkoutSplit, prescriptionForLevel } from "../src/lib/logic/workout-generator";
import { milestoneTemplates } from "../src/lib/logic/milestones";
import { generateGroceryList } from "../src/lib/logic/grocery";
import { calculateAdherenceScore } from "../src/lib/logic/adherence";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/lockdin";
const adapter = new PrismaPg(new Pool({ connectionString }));
const prisma = new PrismaClient({ adapter });

const exerciseSeed = [
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    description: "Horizontal press for chest, triceps, and front delts.",
    executionNotes: ["Drive feet", "Control eccentric", "Touch lower chest"],
    muscleGroups: ["chest", "triceps", "front-delts"],
    movementPattern: "horizontal_push",
    equipment: ["FULL_GYM"],
    difficulty: TrainingLevel.INTERMEDIATE,
    injuryFlags: ["shoulder_pain"],
    isCompound: true,
  },
  {
    slug: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    description: "Joint-friendly horizontal pressing variation.",
    executionNotes: ["Neutral wrist", "Slight arch", "Lockout softly"],
    muscleGroups: ["chest", "triceps", "front-delts"],
    movementPattern: "horizontal_push",
    equipment: ["FULL_GYM", "HOME_GYM", "DUMBBELLS_ONLY"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["severe_shoulder_pain"],
    isCompound: true,
  },
  {
    slug: "push-up",
    name: "Push-Up",
    description: "Scalable bodyweight pressing movement.",
    executionNotes: ["Brace core", "Full range", "Controlled tempo"],
    muscleGroups: ["chest", "triceps", "front-delts", "core"],
    movementPattern: "horizontal_push",
    equipment: ["ANY", "BODYWEIGHT_ONLY", "MINIMAL"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["wrist_pain"],
    isCompound: true,
  },
  {
    slug: "cable-row",
    name: "Cable Row",
    description: "Horizontal pull for lats and mid-back.",
    executionNotes: ["Chest tall", "Squeeze back", "No lower-back swing"],
    muscleGroups: ["lats", "mid-back", "biceps"],
    movementPattern: "horizontal_pull",
    equipment: ["FULL_GYM"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["acute_low_back_pain"],
    isCompound: true,
  },
  {
    slug: "one-arm-db-row",
    name: "One-Arm Dumbbell Row",
    description: "Single-arm row with high equipment accessibility.",
    executionNotes: ["Brace trunk", "Elbow to hip", "Pause at top"],
    muscleGroups: ["lats", "mid-back", "rear-delts"],
    movementPattern: "horizontal_pull",
    equipment: ["FULL_GYM", "HOME_GYM", "DUMBBELLS_ONLY"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["acute_low_back_pain"],
    isCompound: true,
  },
  {
    slug: "leg-press",
    name: "Leg Press",
    description: "Stable lower-body push pattern.",
    executionNotes: ["Mid-foot pressure", "Control depth", "No knee collapse"],
    muscleGroups: ["quads", "glutes"],
    movementPattern: "squat",
    equipment: ["FULL_GYM"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["knee_pain"],
    isCompound: true,
  },
  {
    slug: "goblet-squat",
    name: "Goblet Squat",
    description: "Accessible squat variation with dumbbell or kettlebell.",
    executionNotes: ["Brace core", "Sit between hips", "Drive through midfoot"],
    muscleGroups: ["quads", "glutes", "core"],
    movementPattern: "squat",
    equipment: ["FULL_GYM", "HOME_GYM", "DUMBBELLS_ONLY", "MINIMAL"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["knee_pain"],
    isCompound: true,
  },
  {
    slug: "split-squat",
    name: "Split Squat",
    description: "Unilateral lower body movement with low equipment need.",
    executionNotes: ["Stay tall", "Controlled descent", "Drive through front foot"],
    muscleGroups: ["quads", "glutes"],
    movementPattern: "lunge",
    equipment: ["ANY", "BODYWEIGHT_ONLY", "MINIMAL", "DUMBBELLS_ONLY", "HOME_GYM", "FULL_GYM"],
    difficulty: TrainingLevel.BEGINNER,
    injuryFlags: ["knee_pain"],
    isCompound: true,
  },
];

const substitutionPairs = [
  ["barbell-bench-press", "dumbbell-bench-press", "Equipment or shoulder comfort"],
  ["barbell-bench-press", "push-up", "No barbell available"],
  ["cable-row", "one-arm-db-row", "No cable station available"],
  ["leg-press", "goblet-squat", "No machine access"],
  ["leg-press", "split-squat", "Knee-friendly unilateral fallback"],
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
    create: {
      email,
      name,
      passwordHash,
    },
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
    where: {
      id: `${user.id}-nutrition`,
    },
    update: nutrition,
    create: {
      id: `${user.id}-nutrition`,
      userId: user.id,
      ...nutrition,
    },
  });

  const grocery = generateGroceryList({
    calories: nutrition.calories,
    proteinGrams: nutrition.proteinGrams,
    dietaryPreference: "OMNIVORE",
    style: "balanced",
  });

  await prisma.groceryList.create({
    data: {
      userId: user.id,
      nutritionPlanId: nutritionPlan.id,
      style: "balanced",
      weekOf: new Date(),
      ...grocery,
    },
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

  for (let i = 0; i < split.length; i += 1) {
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

    for (let j = 0; j < Math.min(4, exercisePool.length); j += 1) {
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

  await prisma.adherenceSnapshot.create({
    data: {
      userId: user.id,
      snapshotDate: new Date(),
      workoutsPlanned: 4,
      workoutsCompleted: 4,
      nutritionAdherenceAvg: 82,
      checkInCompletionRate: 100,
      recoveryInputRate: 80,
      streakDays: 19,
      weeklyAdherencePercent: adherence.score,
      monthlyConsistencyScore: 85,
    },
  });

  await prisma.progressCheckIn.create({
    data: {
      userId: user.id,
      dueDate: new Date(),
      completedAt: new Date(),
      workoutDifficulty: 7,
      energy: 7,
      sleepQuality: 6,
      hunger: 5,
      soreness: 4,
      stress: 6,
      confidence: 8,
      motivation: 8,
      intensityPreference: "just_right",
      painFlag: false,
    },
  });

  await prisma.bodyMetricLog.createMany({
    data: [
      {
        userId: user.id,
        loggedAt: new Date(Date.now() - 35 * 24 * 3600 * 1000),
        weightKg: 89.8,
        waistCm: 100,
        energyLevel: 6,
        sleepQuality: 6,
      },
      {
        userId: user.id,
        loggedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        weightKg: 87.7,
        waistCm: 96,
        energyLevel: 7,
        sleepQuality: 7,
      },
    ],
  });

  await prisma.nutritionLog.create({
    data: {
      userId: user.id,
      loggedAt: new Date(),
      macroAdherencePercent: 84,
      calorieAdherencePercent: 82,
      waterLiters: 3.1,
      notes: "Solid adherence with one social meal.",
    },
  });

  await prisma.workoutLog.create({
    data: {
      userId: user.id,
      workoutPlanId: plan.id,
      completed: true,
      completionPercent: 100,
      difficultyRating: 7,
      notes: "Progressed top sets with clean form.",
      performedAt: new Date(),
    },
  });

  await prisma.progressPhoto.createMany({
    data: [
      {
        userId: user.id,
        label: "front",
        imageUrl: "/placeholder/front-week1.jpg",
        takenAt: new Date(Date.now() - 21 * 24 * 3600 * 1000),
      },
      {
        userId: user.id,
        label: "front",
        imageUrl: "/placeholder/front-week4.jpg",
        takenAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
    ],
  });

  for (const m of milestoneTemplates(goal.goalType, goal.timelineWeeks)) {
    await prisma.milestone.create({
      data: {
        userId: user.id,
        title: m.title,
        description: `${m.metricType} target milestone`,
        metricType: m.metricType,
        targetValue: m.targetValue,
        currentValue: m.metricType === "adherence" ? adherence.score : null,
        targetDate: new Date(Date.now() + m.week * 7 * 24 * 3600 * 1000),
      },
    });
  }

  await prisma.weeklyRecap.create({
    data: {
      userId: user.id,
      weekStart: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      workoutsCompleted: 4,
      workoutsPlanned: 4,
      adherenceScore: adherence.score,
      streak: 19,
      bodyTrendSummary: "Weight and waist trending down consistently.",
      milestoneProgress: "Week 8 checkpoint remains on track.",
      topAchievement: "Completed all planned lower sessions.",
      nextFocus: "Improve sleep consistency.",
      shareableCardPayload: {
        style: "neon-premium",
        cards: ["workouts", "adherence", "streak"],
      },
    },
  });

  return user;
}

async function seedSocial(users: { id: string }[]) {
  if (users.length < 2) return;
  for (let i = 1; i < users.length; i += 1) {
    await prisma.friendConnection.upsert({
      where: {
        senderId_receiverId: {
          senderId: users[0].id,
          receiverId: users[i].id,
        },
      },
      update: { status: "ACCEPTED" },
      create: {
        senderId: users[0].id,
        receiverId: users[i].id,
        status: "ACCEPTED",
      },
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
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
