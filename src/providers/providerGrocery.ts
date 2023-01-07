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
