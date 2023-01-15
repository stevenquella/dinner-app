import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { atom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import {
  ensureEmptySuccess,
  ensureSuccess,
  getSingleRow,
  supabase,
} from "./client";
import { notEmpty } from "./helpers";
import {
  Plan,
  PlanInsert,
  PlanMeal,
  PlanMealInsert,
  plan_meal_table,
  plan_table,
} from "./provider.types";
import { groceryQueryKeys } from "./providerGrocery";
import { mealQueryKeys } from "./providerMeal";

const planQueryKeys = {
  plans: (start?: string, end?: string) => ["plans", start, end],
  plansearch: (search: string) => ["plans", "search", search],
  plan: (id: string) => ["plans", "id", id],
};

// ATOMS

export const plansSearchAtom = atom(dayjs().format("YYYY-MM-DD"));
export const [, plansSearchQueryAtom] = atomsWithQuery((get) => ({
  queryKey: planQueryKeys.plansearch(get(plansSearchAtom)),
  queryFn: () => {
    const range = getSearchRange(get(plansSearchAtom));
    return retrievePlans(range?.start, range?.end);
  },
}));

// QUERIES

export const usePlans = (options?: { start?: string; end?: string }) => {
  return useQuery({
    queryKey: planQueryKeys.plans(options?.start, options?.end),
    queryFn: () => {
      return retrievePlans(options?.start, options?.end);
    },
  });
};

export const usePlan = (options: {
  id: string | null;
  onSuccess?: (plan: Plan) => void;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: planQueryKeys.plan(options.id ?? ""),
    queryFn: () => retrievePlan(options.id ?? ""),
    enabled: options.id != null,
    initialData: () => {
      return queryClient
        .getQueryData<Plan[]>(planQueryKeys.plans())
        ?.find((x) => x.id === options.id);
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState(planQueryKeys.plans())?.dataUpdatedAt;
    },
    onSuccess: (meal) => {
      if (meal && options.onSuccess) {
        options.onSuccess(meal);
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

export const usePlanUpsertMutation = (options: {
  onSuccess: (plan: Plan) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { plan: PlanInsert; meals: string[] }) =>
      upsertPlan(data.plan, data.meals),
    onSuccess: (plan: Plan) => {
      queryClient.invalidateQueries({
        queryKey: [planQueryKeys.plans],
      });
      queryClient.invalidateQueries({
        queryKey: groceryQueryKeys.groceriesPlan(plan.id, []),
      });

      queryClient.setQueryData(planQueryKeys.plan(plan.id), plan);

      options.onSuccess(plan);
    },
  });
};

export const usePlanDeleteMutation = (options: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: () => options.onSuccess(),
  });
};

export const usePlanMealUpsertMutation = (options: {
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PlanMealInsert) => upsertPlanMeal(data),
    onSuccess: (item) => {
      queryClient.invalidateQueries(planQueryKeys.plan(item.plan_id));
      queryClient.invalidateQueries(mealQueryKeys.meal(item.meal_id));
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
  return getSingleRow(response);
}

async function upsertPlan(plan: PlanInsert, meals: string[]): Promise<Plan> {
  const upsertPlanResponse = await supabase
    .from(plan_table)
    .upsert(plan)
    .select("id");
  const updatedPlan = getSingleRow(upsertPlanResponse);

  const deletePlanMealsResponse = await supabase
    .from(plan_meal_table)
    .delete()
    .eq("plan_id", updatedPlan.id);

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
  const deletePlanMealsResponse = await supabase
    .from(plan_meal_table)
    .delete()
    .eq("plan_id", id);

  ensureSuccess(deletePlanMealsResponse);

  const deletePlanResponse = await supabase
    .from(plan_table)
    .delete()
    .eq("id", id);

  return ensureEmptySuccess(deletePlanResponse);
}

async function upsertPlanMeal(data: PlanMealInsert): Promise<PlanMeal> {
  const upsertPlanMealResponse = await supabase
    .from(plan_meal_table)
    .upsert(data)
    .select();

  return getSingleRow(upsertPlanMealResponse);
}
