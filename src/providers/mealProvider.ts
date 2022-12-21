import { supabase } from "./client";
import { Database } from "./client.types";

export type MealInsert = Database["public"]["Tables"]["meal"]["Insert"];
export type Meal = Database["public"]["Tables"]["meal"]["Row"];

export async function insertMeal(meal: MealInsert) {
  const { data, error } = await supabase
    .from("meal")
    .insert<MealInsert>(meal)
    .select();
}
