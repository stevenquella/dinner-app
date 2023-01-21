import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { usePlan, usePlanUpsertMutation } from "../../providers/providerPlan";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import ButtonLink from "../items/ButtonLink";
import CardTitle from "../items/CardTitle";
import { MealsRelated } from "../meals/MealsRelated";
import Page, { combineStates, PageState } from "../Page";
import ScrollTop from "../ScrollTop";

type PlanInputs = {
  date: string;
  notes: string;
};

type PlanValidation = {
  [prop in keyof PlanInputs]?: InputValidation;
};

const planValidation: PlanValidation = {
  date: {
    required: {
      value: true,
      message: "Date is required.",
    },
  },
};

export const planMealsAtom = atom<string[]>([]);

export default function PlanEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userid = useAtomValue(useridAtom);

  const isCreate = !(id != null);

  const plan = usePlan({
    id: id ?? null,
    onSuccess: (plan) => {
      formMethods.reset({
        date: plan.date,
        notes: plan.notes ?? "",
      });

      setSelectedMeals(plan.plan_meal.map((x) => x.meal_id));
    },
  });

  const formMethods = useForm<PlanInputs>({
    defaultValues: {
      date: plan.data?.date ?? dayjs().format("YYYY-MM-DD"),
      notes: plan.data?.notes ?? "",
    },
  });

  const planUpsert = usePlanUpsertMutation({
    onSuccess: ({ id }) => {
      if (isCreate) {
        navigate(`/plans/read/${id}`, { replace: true });
      } else {
        navigate(-1);
      }
    },
  });

  const [selectedMeals, setSelectedMeals] = useAtom(planMealsAtom);
  useEffect(() => {
    setSelectedMeals(plan.data?.plan_meal.map((x) => x.meal_id) ?? []);
  }, [plan.data?.plan_meal, setSelectedMeals]);

  const pageState: PageState = isCreate ? combineStates([planUpsert]) : combineStates([plan, planUpsert]);
  return (
    <Page {...pageState}>
      <ScrollTop />
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((x) =>
            planUpsert.mutate({
              plan: {
                id: id,
                user_id: userid,
                ...x,
              },
              meals: selectedMeals,
            })
          )}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              rowGap: 1,
              pb: 2,
            }}
          >
            <Typography variant="h5">{isCreate ? "Create Plan" : "Edit Plan"}</Typography>
            <Button variant="contained" type="submit" disabled={pageState.isLoading || plan.isError}>
              {isCreate ? "Create" : "Update"}
            </Button>
          </Box>

          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: 1,
                }}
              >
                <CardTitle text="Summary" />
                <TextInput name="date" label="Date" type="date" rules={planValidation.date} />
                <TextInput name="notes" label="Notes" />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <CardTitle text={`Meals (${selectedMeals.length})`} />
              <MealsRelated ids={selectedMeals} linkTarget="_blank" />
            </CardContent>
            <CardActions sx={{ py: 1, px: 2, flexDirection: "row-reverse" }}>
              <ButtonLink to="meals" color="secondary" text="Edit Meals" />
            </CardActions>
          </Card>
        </form>
      </FormProvider>

      {!isCreate ? (
        <ButtonLink
          to="delete"
          variant="outlined"
          color="error"
          sx={{ mt: 2 }}
          disabled={pageState.isLoading || pageState.isError}
          text="Delete"
        />
      ) : (
        <span></span>
      )}

      <Outlet />
    </Page>
  );
}
