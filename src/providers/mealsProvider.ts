import { getSingleRow, supabase } from "./client";
import { Database } from "./client.types";

const meal_table = "meal";
export type MealInsert = Database["public"]["Tables"]["meal"]["Insert"];
export type Meal = Database["public"]["Tables"]["meal"]["Row"];

export async function retrieveMeal(id: string): Promise<Meal> {
  const response = await supabase.from(meal_table).select().eq("id", id);
  return getSingleRow<Meal>(response);
}

export async function upsertMeal(meal: MealInsert): Promise<Meal> {
  const response = await supabase
    .from(meal_table)
    .upsert<MealInsert>(meal)
    .select();
  return getSingleRow(response);
}
