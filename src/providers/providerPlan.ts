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
import { Database } from "./client.types";

const plan_table = "plan";
export type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];
export type Plan = Database["public"]["Tables"]["plan"]["Row"] & {
  plan_meal: { meal_id: string } | { meal_id: string }[] | null;
};

const planQueryKeys = {
  plans: ["plans"],
  plansearch: (search: string) => ["plans", "search", search],
  plan: (id: string) => ["plans", "id", id],
};

// ATOMS

export const plansSearchAtom = atom(dayjs().format("YYYY-MM-DD"));
export const [, plansSearchQueryAtom] = atomsWithQuery((get) => ({
  queryKey: planQueryKeys.plansearch(get(plansSearchAtom)),
  queryFn: () => retrievePlans(get(plansSearchAtom)),
}));

// QUERIES

export const prefetchPlans = {
  queryKey: planQueryKeys.plans,
  queryFn: () => retrievePlans(),
};

export const usePlans = () => {
  return useQuery({
    queryKey: planQueryKeys.plans,
    queryFn: () => retrievePlans(),
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
        .getQueryData<Plan[]>([planQueryKeys.plans])
        ?.find((x) => x.id === options.id);
    },
    initialDataUpdatedAt: () => {
      return queryClient.getQueryState([planQueryKeys.plans])?.dataUpdatedAt;
    },
    onSuccess: (meal) => {
      if (meal && options.onSuccess) {
        options.onSuccess(meal);
      }
    },
  });
};

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

// FUNCTIONS
const columns = `
  id,
  user_id,
  date,
  notes,
  plan_meal (
    meal_id
  )`;

async function retrievePlans(search?: string): Promise<Plan[]> {
  let query = supabase.from(plan_table).select(columns).order("date");
  if (search) {
    const searchDate = dayjs(search);
    const start = searchDate.add(-7, "day").toISOString();
    const end = searchDate.add(7, "day").toISOString();
    query = query.gte("date", start).lte("date", end);
  }

  const response = await query;
  return ensureSuccess(response);
}

async function retrievePlan(id: string): Promise<Plan> {
  const response = await supabase.from(plan_table).select(columns).eq("id", id);
  return getSingleRow(response);
}

async function upsertPlan(plan: PlanInsert, meals: string[]): Promise<Plan> {
  const response = await supabase.from(plan_table).upsert(plan).select(columns);
  return getSingleRow(response);
}

async function deletePlan(id: string): Promise<boolean> {
  const response = await supabase.from(plan_table).delete().eq("id", id);
  return ensureEmptySuccess(response);
}
