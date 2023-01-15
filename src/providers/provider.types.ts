import { Database } from "./client.types";

export const grocery_table = "grocery";
export type GroceryInsert = Database["public"]["Tables"]["grocery"]["Insert"];
export type Grocery = Database["public"]["Tables"]["grocery"]["Row"] & {
  meal_grocery: MealGrocery[];
};

export const plan_table = "plan";
export type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];
export type Plan = Database["public"]["Tables"]["plan"]["Row"] & {
  plan_meal: PlanMeal[];
};

export const meal_table = "meal";
export type MealInsert = Database["public"]["Tables"]["meal"]["Insert"];
export type Meal = Database["public"]["Tables"]["meal"]["Row"] & {
  meal_grocery: MealGrocery[];
  plan_meal: PlanMeal[];
};

export const plan_meal_table = "plan_meal";
export type PlanMealInsert =
  Database["public"]["Tables"]["plan_meal"]["Insert"];
export type PlanMeal = Database["public"]["Tables"]["plan_meal"]["Row"];

export const meal_grocery_table = "meal_grocery";
export type MealGrocery = Database["public"]["Tables"]["meal_grocery"]["Row"];
