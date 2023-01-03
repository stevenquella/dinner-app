import { getSingleRow, supabase } from "./client";
import { Database } from "./client.types";

const plan_table = "plan";
export type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];
export type Plan = Database["public"]["Tables"]["plan"]["Row"];

// ATOMS

// QUERIES

// MUTATIONS

export async function upsertPlan(
  plan: PlanInsert,
  meals: string[]
): Promise<Plan> {
  const response = await supabase.from(plan_table).upsert(plan).select();
  return getSingleRow(response);
}
