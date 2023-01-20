import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom } from "jotai";
import { ensureEmptySuccess, ensureSuccess, getSingleRow, supabase } from "./client";
import { notEmpty } from "./helpers";
import { Meal, MealInsert, meal_grocery_table, meal_table, plan_meal_table } from "./provider.types";
import { groceryQueryKeys } from "./providerGrocery";
import { planQueryKeys } from "./providerPlan";

export const mealQueryKeys = {
  root: ["meals"],
  meals_search: (search: string) => ["meals", "search", search],
  meal: (id: string) => ["meals", "id", id],
};

// ATOMS

export const mealsSearchAtom = atom<string>("");

// QUERIES

export const useMeals = (search?: string) => {
  return useQuery({
    queryKey: search ? mealQueryKeys.meals_search(search) : mealQueryKeys.root,
    queryFn: () => retrieveMeals(search),
  });
};

export const useMeal = (options: { id: string | null; onSuccess?: (meal: Meal) => void }) => {
  return useQuery({
    queryKey: mealQueryKeys.meal(options.id ?? ""),
    queryFn: () => retrieveMeal(options.id ?? ""),
    enabled: options.id != null,
    onSuccess: (meal) => {
      if (meal && options.onSuccess) {
        options.onSuccess(meal);
      }
    },
  });
};

export function getMealsById(meals?: Meal[] | undefined, ids?: string[]) {
  return (
    ids
      ?.map((id) => meals?.find((m) => m.id === id))
      .filter(notEmpty)
      .sort((a, b) => a.name.localeCompare(b.name)) ?? []
  );
}

// MUTATIONS

export const useMealUpsertMutation = (options: { onSuccess: (id: string) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { meal: MealInsert; groceries: string[] }) => upsertMeal(data.meal, data.groceries),
    onSuccess: (meal) => {
      queryClient.invalidateQueries(planQueryKeys.root);
      queryClient.invalidateQueries(mealQueryKeys.root);
      queryClient.invalidateQueries(groceryQueryKeys.root);
      options.onSuccess(meal.id);
    },
  });
};

export const useMealDeleteMutation = (options: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries(planQueryKeys.root);
      queryClient.invalidateQueries(mealQueryKeys.root);
      queryClient.invalidateQueries(groceryQueryKeys.root);
      options.onSuccess();
    },
  });
};

// FUNCTIONS

const columns = `
  id,
  user_id,
  name,
  notes,
  meal_grocery (*),
  plan_meal (*)
`;

async function retrieveMeals(search?: string): Promise<Meal[]> {
  let query = supabase.from(meal_table).select(columns).order("name");
  if (search) {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const response = await query;
  return ensureSuccess(response);
}

async function retrieveMeal(id: string): Promise<Meal> {
  const response = await supabase.from(meal_table).select(columns).eq("id", id);
  return getSingleRow<Meal>(response);
}

async function upsertMeal(meal: MealInsert, groceries: string[]): Promise<Meal> {
  const upsertMealResponse = await supabase.from(meal_table).upsert<MealInsert>(meal).select("id");
  const updatedMeal = getSingleRow(upsertMealResponse);

  const deleteGroceriesResponse = await supabase.from(meal_grocery_table).delete().eq("meal_id", updatedMeal.id);

  ensureSuccess(deleteGroceriesResponse);

  const upsertGroceriesResponse = await supabase.from(meal_grocery_table).upsert(
    groceries.map((id) => ({
      user_id: meal.user_id,
      meal_id: updatedMeal.id,
      grocery_id: id,
    }))
  );

  ensureSuccess(upsertGroceriesResponse);

  return retrieveMeal(updatedMeal.id);
}

async function deleteMeal(id: string): Promise<boolean> {
  const deletePlanMealsResponse = await supabase.from(plan_meal_table).delete().eq("meal_id", id);

  ensureSuccess(deletePlanMealsResponse);

  const deleteGroceriesResponse = await supabase.from(meal_grocery_table).delete().eq("meal_id", id);

  ensureSuccess(deleteGroceriesResponse);

  const response = await supabase.from(meal_table).delete().eq("id", id);
  return ensureEmptySuccess(response);
}
