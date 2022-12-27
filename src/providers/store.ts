import { Session } from "@supabase/supabase-js";
import create from "zustand";

export type StoreState = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

const useStore = create<StoreState>((set) => ({
  session: null,
  setSession: (sesh) => set((_) => ({ session: sesh })),
}));

export default useStore;
