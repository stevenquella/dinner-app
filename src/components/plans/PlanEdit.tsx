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
import { useAtom } from "jotai";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import {
  usePlan,
  usePlanDeleteMutation,
  usePlanUpsertMutation,
} from "../../providers/providerPlan";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import Page, { combineStates, PageState } from "../Page";

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
  const { id } = useParams();
  const [userid] = useAtom(useridAtom);
  const [editMeals, setEditMeals] = useState<boolean>(false);

  const isCreate = !(id != null);

  const formMethods = useForm<PlanInputs>({
    defaultValues: {
      date: "",
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
    },
  });
  const planUpsert = usePlanUpsertMutation({
    onSuccess: () => {},
  });
  const planDelete = usePlanDeleteMutation({
    onSuccess: () => {},
  });

  const pageState: PageState = isCreate
    ? combineStates([planUpsert])
    : combineStates([plan, planUpsert, planDelete]);

  return (
    <Page {...pageState}>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((x) =>
            planUpsert.mutate({
              plan: {
                id: id,
                user_id: userid,
                ...x,
              },
              meals: [],
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
            <Typography variant="h5">
              {isCreate ? "Create Plan" : "Edit Plan"}
            </Typography>
            <Button
              variant="contained"
              type="submit"
              disabled={pageState.isLoading || plan.isError}
            >
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
                <Typography variant="body1">Summary</Typography>
                <TextInput
                  name="date"
                  label="Date"
                  type="date"
                  rules={planValidation.date}
                />
                <TextInput name="notes" label="Notes" />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="body1">Meals</Typography>
            </CardContent>
            <CardActions sx={{ py: 1, px: 2, flexDirection: "row-reverse" }}>
              <Button color="secondary" onClick={() => setEditMeals(true)}>
                Edit Meals
              </Button>
            </CardActions>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="body1">Groceries</Typography>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
      <Dialog maxWidth="md" fullWidth={true} open={editMeals}>
        <DialogTitle>Select Meals</DialogTitle>
        <DialogActions>
          <Button onClick={() => setEditMeals(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
