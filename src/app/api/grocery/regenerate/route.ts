import { NextRequest, NextResponse } from "next/server";
import { generateGroceryList } from "@/lib/logic/grocery";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    calories?: number;
    proteinGrams?: number;
    dietaryPreference?: string;
    style?: "balanced" | "budget" | "convenience";
  };

  const list = generateGroceryList({
    calories: body.calories ?? 2200,
    proteinGrams: body.proteinGrams ?? 170,
    dietaryPreference: body.dietaryPreference,
    style: body.style ?? "balanced",
  });

  return NextResponse.json(list);
}
