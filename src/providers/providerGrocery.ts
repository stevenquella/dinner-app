import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess, getSingleRow, supabase } from "./client";
import { Database } from "./client.types";
import { notEmpty } from "./helpers";

const grocery_table = "grocery";
export const groceryQueryKeys = {
  groceries: ["groceries"],
  groceriesPlan: (planId: string, mealIds: string[]) => [
    "groceries",
    "plan",
    planId,
    ...mealIds,
  ],
  groceryContent: (category: string, name: string) => [
    "groceries",
    "content",
    category,
    name,
  ],
};

export type GroceryMeal = Database["public"]["Tables"]["meal_grocery"]["Row"];
export type Grocery = Database["public"]["Tables"]["grocery"]["Row"] & {
  meal_grocery: GroceryMeal[];
};
export type GroceryInsert = Database["public"]["Tables"]["grocery"]["Insert"];

export const groceryCategories = [
  "Produce",
  "Protein",
  "Bakery",
  "Dairy",
  "Pantry",
  "Frozen",
  "Other",
] as const;

export type GroceryCategory = typeof groceryCategories[number];

export const groceryCategorySelect = groceryCategories.map((x) => ({
  value: x,
  text: x,
}));

// QUERIES

export const useGroceries = () => {
  return useQuery({
    queryKey: groceryQueryKeys.groceries,
    queryFn: () => retrieveGroceries(),
  });
};

export const usePlanGroceries = (
  planId: string,
  mealIds: string[],
  enabled: boolean
) => {
  return useQuery({
    queryKey: groceryQueryKeys.groceriesPlan(planId, mealIds),
    queryFn: () => retrievePlanGroceries(mealIds),
    enabled: enabled,
  });
};

export function getGroceriesById(
  groceries?: Grocery[] | undefined,
  ids?: string[]
) {
  return (
    ids
      ?.map((id) => groceries?.find((x) => x.id === id))
      .filter(notEmpty)
      .sort((a, b) => a.name.localeCompare(b.name)) ?? []
  );
}

// MUTATIONS

export const useGroceryUpsertMutation = (options: {
  onSuccess: (g: Grocery) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroceryInsert) => upsertGrocery(data),
    onSuccess: (grocery: Grocery) => {
      queryClient.invalidateQueries(groceryQueryKeys.groceries);
      options.onSuccess(grocery);
    },
  });
};

// FUNCTIONS

async function retrieveGroceries(): Promise<Grocery[]> {
  const columns = `
    *,
    meal_grocery(*)
  `;
  const response = await supabase.from(grocery_table).select(columns);
  return ensureSuccess(response);
}

async function retrievePlanGroceries(mealIds: string[]): Promise<Grocery[]> {
  const columns = `
    *,
    meal_grocery!inner(*)
  `;
  const response = await supabase
    .from(grocery_table)
    .select(columns)
    .in("meal_grocery.meal_id", mealIds);

  return ensureSuccess(response);
}

async function upsertGrocery(grocery: GroceryInsert): Promise<Grocery> {
  grocery.name = grocery.name.trim();
  grocery.category = grocery.category.trim();

  const response = await supabase.from(grocery_table).upsert(grocery).select();
  return getSingleRow(response);
}
