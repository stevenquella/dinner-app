import { Session } from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import { atom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import { retrieveMeals } from "./providerMeal";

export const query = new QueryClient();

export const sessionAtom = atom<Session | null>(null);
export const useridAtom = atom((get) => get(sessionAtom)?.user.id ?? "");

export const [mealsDataAtom, mealsQueryAtom] = atomsWithQuery((get) => ({
  queryKey: ["meals"],
  queryFn: () => retrieveMeals(),
}));

export const mealsSearchAtom = atom<string>("");
export const [mealsSearchDataAtom, mealsSearchQueryAtom] = atomsWithQuery(
  (get) => ({
    queryKey: ["meals", get(mealsSearchAtom)],
    queryFn: () => retrieveMeals(get(mealsSearchAtom)),
  })
);
