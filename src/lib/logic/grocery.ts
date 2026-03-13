type GroceryInput = {
  calories: number;
  proteinGrams: number;
  dietaryPreference?: string;
  style: "balanced" | "budget" | "convenience";
};

export function generateGroceryList(input: GroceryInput) {
  const highProtein = input.style === "convenience";
  const budget = input.style === "budget";

  const proteins = highProtein
    ? [
        "Greek yogurt cups",
        "ready protein shakes",
        "rotisserie chicken",
        "tuna packets",
      ]
    : budget
      ? ["eggs", "chicken thigh", "dry lentils", "cottage cheese"]
      : ["chicken breast", "salmon", "extra firm tofu", "lean ground turkey"];

  const carbs = budget
    ? ["oats", "rice", "potatoes", "bananas"]
    : ["jasmine rice", "sweet potatoes", "berries", "whole-grain wraps"];

  const fats = ["olive oil", "avocado", "mixed nuts", "natural peanut butter"];

  const vegetarianSwap =
    input.dietaryPreference?.includes("VEGAN") ||
    input.dietaryPreference?.includes("VEGETARIAN");

  return {
    proteinItems: vegetarianSwap
      ? ["tofu", "tempeh", "seitan", "edamame"]
      : proteins,
    carbItems: carbs,
    fatItems: fats,
    fruitItems: ["blueberries", "bananas", "apples"],
    vegetableItems: ["spinach", "broccoli", "bell peppers", "mixed greens"],
    snackItems: ["protein bar", "rice cakes", "hummus"],
    hydrationItems: ["electrolyte packets", "sparkling water", "green tea"],
  };
}
