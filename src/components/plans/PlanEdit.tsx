import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { usePlan, usePlanDeleteMutation, usePlanUpsertMutation } from "../../providers/providerPlan";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import CardTitle from "../items/CardTitle";
import { MealsRelated } from "../meals/MealsRelated";
import Page, { combineStates, PageState } from "../Page";
import ScrollTop from "../ScrollTop";
import PlanMealsEdit from "./PlanMealsEdit";

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

export default function PlanEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userid] = useAtom(useridAtom);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [editMeals, setEditMeals] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const isCreate = !(id != null);

  const formMethods = useForm<PlanInputs>({
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"),
      notes: "",
    },
  });

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
  const planUpsert = usePlanUpsertMutation({
    onSuccess: ({ id }) => {
      if (isCreate) {
        navigate(`/plans/read/${id}`, { replace: true });
      } else {
        navigate(-1);
      }
    },
  });
  const planDelete = usePlanDeleteMutation({
    onSuccess: () => navigate(`/`, { replace: true }),
  });

  const pageState: PageState = isCreate ? combineStates([planUpsert]) : combineStates([plan, planUpsert, planDelete]);

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
              <Button color="secondary" onClick={() => setEditMeals(true)}>
                Edit Meals
              </Button>
            </CardActions>
          </Card>
        </form>
      </FormProvider>
      <PlanMealsEdit
        open={editMeals}
        onDismiss={() => setEditMeals(false)}
        selectedMeals={selectedMeals}
        onChangeSelectedMeals={setSelectedMeals}
      />
      {!isCreate ? (
        <div>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => setConfirmDelete(true)}
            disabled={pageState.isLoading || pageState.isError}
          >
            DELETE
          </Button>
          <Dialog maxWidth="sm" fullWidth={true} open={confirmDelete}>
            <DialogTitle>Delete plan?</DialogTitle>
            <DialogActions>
              <Button color="info" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button color="error" onClick={() => planDelete.mutate(id ?? "")}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}
    </Page>
  );
}
