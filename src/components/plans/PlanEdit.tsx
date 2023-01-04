import { OpenInNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { useMeals } from "../../providers/providerMeal";
import {
  usePlan,
  usePlanDeleteMutation,
  usePlanUpsertMutation,
} from "../../providers/providerPlan";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import Page, { combineStates, PageState } from "../Page";
import PlanMeals from "./PlanMeals";

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

  const isCreate = !(id != null);

  const formMethods = useForm<PlanInputs>({
    defaultValues: {
      date: "",
      notes: "",
    },
  });

  const meals = useMeals();
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
    onSuccess: ({ id }) => {
      if (isCreate) {
        navigate(`/plans/edit/${id}`, { replace: true });
      } else {
        navigate(-1);
      }
    },
  });
  const planDelete = usePlanDeleteMutation({
    onSuccess: () => navigate(`/plans`, { replace: true }),
  });

  const pageState: PageState = isCreate
    ? combineStates([meals, planUpsert])
    : combineStates([meals, plan, planUpsert, planDelete]);

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
              <List>
                {selectedMeals.map((mealid) => {
                  const meal = meals.data?.find((x) => x.id === mealid);
                  if (meal) {
                    return (
                      <ListItem
                        key={mealid}
                        sx={{
                          p: 1.5,
                          mb: 1,
                          border: 1,
                          borderColor: "divider",
                        }}
                        secondaryAction={
                          <IconButton edge="end">
                            <OpenInNew />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={meal.name} />
                      </ListItem>
                    );
                  } else {
                    return null;
                  }
                })}
              </List>
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
      <PlanMeals
        open={editMeals}
        onDismiss={() => setEditMeals(false)}
        selectedMeals={selectedMeals}
        onChangeSelectedMeals={setSelectedMeals}
      />
    </Page>
  );
}
