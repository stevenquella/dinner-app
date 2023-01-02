import { Session } from "@supabase/supabase-js";
import { atom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import { mealQueryKeys, retrieveMeals } from "./providerMeal";

export const sessionAtom = atom<Session | null>(null);
export const useridAtom = atom((get) => get(sessionAtom)?.user.id ?? "");

export const [mealsDataAtom, mealsQueryAtom] = atomsWithQuery(() => ({
  queryKey: [mealQueryKeys.meals],
  queryFn: () => retrieveMeals(),
}));
