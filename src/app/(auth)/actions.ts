"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password || password.length < 8) {
    redirect("/signup?error=invalid_input");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect("/signup?error=email_exists");

  const passwordHash = await hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} },
      goalProfile: {
        create: {
          goalType: "GENERAL_FITNESS",
          timelineWeeks: 12,
          targetWorkoutDaysPerWeek: 4,
          sessionLengthMinutes: 50,
          trainingLevel: "BEGINNER",
          equipmentType: "MINIMAL",
          workoutsPerWeek: 4,
        },
      },
      privacySettings: { create: {} },
      notificationPref: { create: { preferredTime: "07:30" } },
    },
  });

  redirect("/login");
}
