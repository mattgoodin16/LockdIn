import { NotificationTone } from "@prisma/client";

const toneLibrary: Record<NotificationTone, string[]> = {
  AGGRESSIVE: [
    "Clock in. Targets do not hit themselves.",
    "No excuses today. Execute your plan.",
  ],
  ENCOURAGING: [
    "You are building momentum. One quality session today.",
    "Small wins stack. Stay consistent.",
  ],
  DISCIPLINED: [
    "Reminder: complete the scheduled workout and log adherence.",
    "Process over mood. Follow the structure.",
  ],
  COACH: [
    "Focus on clean reps, honest logging, and quality recovery today.",
    "Great week to progress. Keep effort steady and controlled.",
  ],
  MINIMAL: ["Workout reminder.", "Check-in due."],
};

export function generateNotificationMessage(tone: NotificationTone, category: string) {
  const list = toneLibrary[tone] ?? toneLibrary.COACH;
  const base = list[Math.floor(Math.random() * list.length)];
  return `${base} (${category})`;
}
