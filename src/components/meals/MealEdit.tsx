import { Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../App";
import { getErrorMessage } from "../../providers/helpers";
import { retrieveMeal, upsertMeal } from "../../providers/mealsProvider";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import Page from "../Page";

type MealInputs = {
  name: string;
  notes: string;
};

type MealValidation = {
  [prop in keyof MealInputs]?: InputValidation;
};

const formValidation: MealValidation = {
  name: {
    required: {
      value: true,
      message: "Name is required.",
    },
  },
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
    <Page busy={formMethods.formState.isSubmitting} error={error}>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
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
              {isCreate ? "Create Meal" : "Edit Meal"}
            </Typography>
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
                  name="name"
                  label="Name"
                  rules={formValidation.name}
                />
                <TextInput name="notes" label="Notes" multiline rows={10} />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="body1">Groceries</Typography>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="body1">Tags</Typography>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </Page>
  );
}
