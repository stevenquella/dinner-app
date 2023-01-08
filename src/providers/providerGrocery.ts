import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess, getSingleRow, supabase } from "./client";
import { Database } from "./client.types";
import { notEmpty } from "./helpers";

const grocery_table = "grocery";
const groceryQueryKeys = {
  groceries: ["groceries"],
  groceryContent: (category: string, name: string) => [
    "groceries",
    "content",
    category,
    name,
  ],
};

export type Grocery = Database["public"]["Tables"]["grocery"]["Row"];
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
  const response = await supabase.from(grocery_table).select();
  return ensureSuccess(response);
}

async function upsertGrocery(grocery: GroceryInsert): Promise<Grocery> {
  grocery.name = grocery.name.trim();
  grocery.category = grocery.category.trim();

  const response = await supabase.from(grocery_table).upsert(grocery).select();
  return getSingleRow(response);
}
