import { NextRequest, NextResponse } from "next/server";
import { NotificationTone } from "@prisma/client";
import { generateNotificationMessage } from "@/lib/logic/notifications";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    tone?: NotificationTone;
    categories?: string[];
    preferredTime?: string;
  };

  const tone = body.tone ?? "COACH";
  const categories = body.categories ?? ["WORKOUT", "CHECK_IN"];

  return NextResponse.json({
    preferredTime: body.preferredTime ?? "07:30",
    scheduled: categories.map((category) => ({
      category,
      message: generateNotificationMessage(tone, category),
    })),
    delivery: "stub_only",
  });
}
