import { Session } from "@supabase/supabase-js";
import { atom } from "jotai";

export const sessionAtom = atom<Session | null>(null);
export const useridAtom = atom((get) => get(sessionAtom)?.user.id ?? "");

export const mealSearchAtom = atom<string>("");
