import { Session } from "@supabase/supabase-js";
import produce from "immer";
import create from "zustand";

export type StoreState = {
  // state
  session: Session | null;
  mealSearch: string;

  // action
  setSession: (session: Session | null) => void;
  setMealSearch: (search: string | null) => void;
};

const useStore = create<StoreState>((set) => ({
  session: null,
  mealSearch: "",

  setSession: (sesh) =>
    set(
      produce((draft) => {
        draft.session = sesh;
      })
    ),
  setMealSearch: (val) =>
    set(
      produce((draft) => {
        draft.mealSearch = val;
      })
    ),
}));

export default useStore;
