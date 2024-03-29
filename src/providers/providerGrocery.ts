import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess, getSingleRow, supabase } from "./client";
import { notEmpty } from "./helpers";
import { Grocery, GroceryInsert, grocery_table } from "./provider.types";

export const groceryQueryKeys = {
  root: ["groceries"],
  grocery: (id: string) => ["groceries", "id", id],
};

export const groceryCategories = ["Produce", "Protein", "Dairy", "Pantry", "Frozen", "Bakery", "Other"] as const;

export type GroceryCategory = typeof groceryCategories[number];

export const groceryCategorySelect = groceryCategories.map((x) => ({
  value: x,
  text: x,
}));

// QUERIES

export const useGroceries = () => {
  return useQuery({
    queryKey: groceryQueryKeys.root,
    queryFn: () => retrieveGroceries(),
  });
};

export const useGrocery = (id: string) => {
  return useQuery({
    queryKey: groceryQueryKeys.grocery(id),
    queryFn: () => retrieveGrocery(id),
  });
};

export function getGroceriesById(groceries?: Grocery[] | undefined, ids?: string[]) {
  return (
    ids
      ?.map((id) => groceries?.find((x) => x.id === id))
      .filter(notEmpty)
      .sort((a, b) => a.name.localeCompare(b.name)) ?? []
  );
}

// MUTATIONS

export const useGroceryUpsertMutation = (options: { onSuccess: (g: Grocery) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroceryInsert) => upsertGrocery(data),
    onSuccess: (grocery: Grocery) => {
      queryClient.invalidateQueries(groceryQueryKeys.root);
      options.onSuccess(grocery);
    },
  });
};

// FUNCTIONS
const columns = `
    *,
    meal_grocery(*)
  `;

async function retrieveGroceries(): Promise<Grocery[]> {
  const response = await supabase.from(grocery_table).select(columns).order("name");
  return ensureSuccess(response);
}

async function retrieveGrocery(id: string): Promise<Grocery> {
  const response = await supabase.from(grocery_table).select(columns).eq("id", id);
  return getSingleRow(response);
}

async function upsertGrocery(grocery: GroceryInsert): Promise<Grocery> {
  grocery.name = grocery.name.trim();
  grocery.category = grocery.category.trim();

  const response = await supabase.from(grocery_table).upsert(grocery).select();
  return getSingleRow(response);
}
