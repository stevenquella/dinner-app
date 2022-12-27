import {
  ensureEmptySuccess,
  ensureSuccess,
  getSingleRow,
  supabase,
} from "./client";
import { Database } from "./client.types";

const meal_table = "meal";
export type MealInsert = Database["public"]["Tables"]["meal"]["Insert"];
export type Meal = Database["public"]["Tables"]["meal"]["Row"];

export const mealQueries = {
  meals: "meals",
  meal: "meal",
};

export async function retrieveMeals(search: string): Promise<Meal[]> {
  let query = supabase.from(meal_table).select().order("name");
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const response = await query;
  return ensureSuccess(response);
}

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

export async function deleteMeal(id: string): Promise<boolean> {
  const response = await supabase.from(meal_table).delete().eq("id", id);
  return ensureEmptySuccess(response);
}
