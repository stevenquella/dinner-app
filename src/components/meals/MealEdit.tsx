import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../App";
import { getErrorMessage } from "../../providers/helpers";
import { retrieveMeal, upsertMeal } from "../../providers/mealsProvider";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";

type MealInputs = {
  name: string;
  notes: string;
};

type MealValidation = {
  [prop in keyof MealInputs]?: InputValidation;
};

export default function MealEdit() {
  const { id } = useParams();
  const { session } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const formMethods = useForm<MealInputs>({
    defaultValues: {
      name: "",
      notes: "",
    },
  });
  const formValidation: MealValidation = {
    name: {
      required: {
        value: true,
        message: "Name is required.",
      },
    },
  };

  const isCreate: boolean = !(id != null);

  const onSubmit = async function (inputs: MealInputs) {
    let meal;
    try {
      meal = await upsertMeal({
        id: id,
        user_id: session.user.id,
        name: inputs.name,
        notes: inputs.notes,
      });
    } catch (error) {
      setError(getErrorMessage(error));
    }

    if (meal != null && isCreate) {
      navigate(`/meals/edit/${meal.id}`, { replace: true });
    }
  };

  useEffect(() => {
    (async () => {
      if (id != null) {
        try {
          const meal = await retrieveMeal(id);
          formMethods.reset({
            name: meal.name,
            notes: meal.notes ?? "",
          });
        } catch (error) {
          setError(getErrorMessage(error));
        }
      }
    })();
  }, [formMethods, id]);

  return (
    <div>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Grid container direction="column" sx={{ p: 1 }} rowSpacing={2}>
            <Grid item>
              <Typography variant="h5">
                {isCreate ? "Create Meal" : "Edit Meal"}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                disabled={formMethods.formState.isSubmitting || error != null}
              >
                {formMethods.formState.isSubmitting
                  ? "Processing..."
                  : isCreate
                  ? "Create"
                  : "Update"}
              </Button>
            </Grid>
          </Grid>
          <Card>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="stretch"
                rowSpacing={1}
              >
                <Grid item>
                  <Typography variant="body1">Summary</Typography>
                </Grid>
                <Grid item>
                  <TextInput
                    name="name"
                    label="Name"
                    rules={formValidation.name}
                  />
                </Grid>
                <Grid item>
                  <TextInput name="notes" label="Notes" multiline rows={10} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="stretch"
                rowSpacing={1}
              >
                <Grid item>
                  <Typography variant="body1">Groceries</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Grid
                container
                direction="column"
                alignItems="stretch"
                rowSpacing={1}
              >
                <Grid item>
                  <Typography variant="body1">Tags</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}
