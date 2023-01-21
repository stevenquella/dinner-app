import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ensureEmptySuccess, ensureSuccess, getSingleRow, supabase } from "./client";
import { notEmpty } from "./helpers";
import {
  Grocery,
  grocery_table,
  Plan,
  PlanInsert,
  PlanMeal,
  PlanMealInsert,
  plan_meal_table,
  plan_table,
} from "./provider.types";
import { mealQueryKeys } from "./providerMeal";

export const planQueryKeys = {
  root: ["plans"],
  plans_search: (start?: string, end?: string) => ["plans", "search", start, end],
  plan: (id: string) => ["plans", "id", id],
};

// QUERIES

export const usePlans = (options?: { start?: string; end?: string }) => {
  return useQuery({
    queryKey: options ? planQueryKeys.plans_search(options?.start, options?.end) : planQueryKeys.root,
    queryFn: () => retrievePlans(options?.start, options?.end),
  });
};

export const usePlan = (options: { id: string | null; onSuccess?: (plan: Plan) => void }) => {
  return useQuery({
    queryKey: planQueryKeys.plan(options.id ?? ""),
    queryFn: () => retrievePlan(options.id ?? ""),
    enabled: options.id != null,
    onSuccess: (plan) => {
      if (plan && options.onSuccess) {
        options.onSuccess(plan);
      }
    },
  });
};

export function getSearchRange(date: string) {
  if (date) {
    const searchDate = dayjs(date);
    const start = searchDate.add(-7, "day").format("YYYY-MM-DD");
    const end = searchDate.add(7, "day").format("YYYY-MM-DD");
    return { start, end };
  }
}

export function getPlansById(plans?: Plan[] | undefined, ids?: string[]) {
  return (
    ids
      ?.map((id) => plans?.find((x) => x.id === id))
      .filter(notEmpty)
      .sort((a, b) => b.date.localeCompare(a.date)) ?? []
  );
}

// MUTATIONS

export const usePlanUpsertMutation = (options: { onSuccess: (plan: Plan) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { plan: PlanInsert; meals: string[] }) => upsertPlan(data.plan, data.meals),
    onSuccess: (plan: Plan) => {
      queryClient.invalidateQueries(planQueryKeys.root);
      queryClient.invalidateQueries(mealQueryKeys.root);
      options.onSuccess(plan);
    },
  });
};

export const usePlanDeleteMutation = (options: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries(planQueryKeys.root);
      queryClient.invalidateQueries(mealQueryKeys.root);
      options.onSuccess();
    },
  });
};

export const usePlanMealUpsertMutation = (options: { onSuccess: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlanMealInsert) => upsertPlanMeal(data),
    onSuccess: (item) => {
      queryClient.invalidateQueries(planQueryKeys.root);
      queryClient.invalidateQueries(mealQueryKeys.root);
      options.onSuccess();
    },
  });
};

// FUNCTIONS
const columns = `
  id,
  user_id,
  date,
  notes,
  plan_meal (*)`;

async function retrievePlans(start?: string, end?: string): Promise<Plan[]> {
  let query = supabase.from(plan_table).select(columns).order("date");

  if (start) {
    query = query.gte("date", start);
  }

  if (end) {
    query = query.lte("date", end);
  }

  const response = await query;
  return ensureSuccess(response);
}

async function retrievePlan(id: string): Promise<Plan> {
  const response = await supabase.from(plan_table).select(columns).eq("id", id);

  const plan = getSingleRow<Plan>(response);

  if (plan.plan_meal.length > 0) {
    const groceryColumns = `
    *,
    meal_grocery!inner(*)
  `;
    const groceries = await supabase
      .from(grocery_table)
      .select(groceryColumns)
      .in(
        "meal_grocery.meal_id",
        plan.plan_meal.map((x) => x.meal_id)
      );

    plan.groceries = ensureSuccess<Grocery>(groceries);
  }

  return plan;
}

async function upsertPlan(plan: PlanInsert, meals: string[]): Promise<Plan> {
  const upsertPlanResponse = await supabase.from(plan_table).upsert(plan).select("id");
  const updatedPlan = getSingleRow(upsertPlanResponse);

  const deletePlanMealsResponse = await supabase.from(plan_meal_table).delete().eq("plan_id", updatedPlan.id);

  ensureSuccess(deletePlanMealsResponse);

  const upsertPlanMealsResponse = await supabase.from(plan_meal_table).upsert(
    meals.map((id) => ({
      plan_id: updatedPlan.id,
      meal_id: id,
      user_id: plan.user_id,
    }))
  );

  ensureSuccess(upsertPlanMealsResponse);

  return retrievePlan(updatedPlan.id);
}

async function deletePlan(id: string): Promise<boolean> {
  const deletePlanMealsResponse = await supabase.from(plan_meal_table).delete().eq("plan_id", id);

  ensureSuccess(deletePlanMealsResponse);

  const deletePlanResponse = await supabase.from(plan_table).delete().eq("id", id);

  return ensureEmptySuccess(deletePlanResponse);
}

async function upsertPlanMeal(data: PlanMealInsert): Promise<PlanMeal> {
  const upsertPlanMealResponse = await supabase.from(plan_meal_table).upsert(data).select();

  return getSingleRow(upsertPlanMealResponse);
}
