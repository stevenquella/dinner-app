import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import {
  ensureEmptySuccess,
  ensureSuccess,
  getSingleRow,
  supabase,
} from "./client";
import { Database } from "./client.types";
import { notEmpty } from "./helpers";

const meal_table = "meal";
export type MealInsert = Database["public"]["Tables"]["meal"]["Insert"];
export type Meal = Database["public"]["Tables"]["meal"]["Row"];

const mealQueryKeys = {
  meals: ["meals"],
  mealsearch: (search: string) => ["meals", "search", search],
  meal: (id: string) => ["meals", "id", id],
};

// ATOMS

export const mealsSearchAtom = atom<string>("");
export const [, mealsSearchQueryAtom] = atomsWithQuery((get) => ({
  queryKey: mealQueryKeys.mealsearch(get(mealsSearchAtom)),
  queryFn: () => retrieveMeals(get(mealsSearchAtom)),
}));

// QUERIES

export const useMeals = () => {
  return useQuery({
    queryKey: mealQueryKeys.meals,
    queryFn: () => retrieveMeals(),
  });
};

export const useMeal = (options: {
  id: string | null;
  onSuccess?: (meal: Meal) => void;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: mealQueryKeys.meal(options.id ?? ""),
    queryFn: () => retrieveMeal(options.id ?? ""),
    enabled: options.id != null,
    initialData: () => {
      return queryClient
        .getQueryData<Meal[]>(mealQueryKeys.meals)
        ?.find((x) => x.id === options.id);
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(mealQueryKeys.meals)?.dataUpdatedAt;
    },
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

export const useMealUpsertMutation = (options: {
  onSuccess: (id: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meal: MealInsert) => upsertMeal(meal),
    onSuccess: (meal) => {
      queryClient.invalidateQueries({
        queryKey: [mealQueryKeys.meals],
      });

      queryClient.setQueryData(mealQueryKeys.meal(meal.id), meal);

      options.onSuccess(meal.id);
    },
  });
};

export const useMealDeleteMutation = (options: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [mealQueryKeys.meals],
      });

      options.onSuccess();
    },
  });
};

// FUNCTIONS

async function retrieveMeals(search?: string): Promise<Meal[]> {
  let query = supabase.from(meal_table).select().order("name");
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const response = await query;
  return ensureSuccess(response);
}

async function retrieveMeal(id: string): Promise<Meal> {
  const response = await supabase.from(meal_table).select().eq("id", id);
  return getSingleRow<Meal>(response);
}

async function upsertMeal(meal: MealInsert): Promise<Meal> {
  const response = await supabase
    .from(meal_table)
    .upsert<MealInsert>(meal)
    .select();
  return getSingleRow(response);
}

async function deleteMeal(id: string): Promise<boolean> {
  const response = await supabase.from(meal_table).delete().eq("id", id);
  return ensureEmptySuccess(response);
}
