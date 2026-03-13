import { GoalType } from "@prisma/client";

export function milestoneTemplates(goal: GoalType, timelineWeeks: number) {
  const half = Math.max(2, Math.floor(timelineWeeks / 2));

  if (goal === "FAT_LOSS") {
    return [
      {
        title: "Consistency lock",
        metricType: "adherence",
        targetValue: 80,
        week: 4,
      },
      {
        title: "Mid-cut checkpoint",
        metricType: "weight_delta",
        targetValue: -3,
        week: half,
      },
      {
        title: "Final target window",
        metricType: "weight_delta",
        targetValue: -6,
        week: timelineWeeks,
      },
    ];
  }

  if (goal === "MUSCLE_GAIN") {
    return [
      {
        title: "Execution baseline",
        metricType: "adherence",
        targetValue: 80,
        week: 4,
      },
      {
        title: "Strength checkpoint",
        metricType: "key_lift",
        targetValue: 5,
        week: half,
      },
      {
        title: "Mass phase target",
        metricType: "weight_delta",
        targetValue: 2,
        week: timelineWeeks,
      },
    ];
  }

  return [
    { title: "Habit streak", metricType: "streak", targetValue: 21, week: 4 },
    {
      title: "Performance checkpoint",
      metricType: "workout_completion",
      targetValue: 85,
      week: half,
    },
    {
      title: "Goal completion target",
      metricType: "adherence",
      targetValue: 85,
      week: timelineWeeks,
    },
  ];
}
