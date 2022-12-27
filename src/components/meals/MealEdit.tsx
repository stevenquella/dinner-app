import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../App";
import { getErrorMessage } from "../../providers/helpers";
import {
  deleteMeal,
  retrieveMeal,
  upsertMeal,
} from "../../providers/mealsProvider";
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

  const isCreate: boolean = !(id != null);

  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const formMethods = useForm<MealInputs>({
    defaultValues: {
      name: "",
      notes: "",
    },
  });
  const mealMutation = useMutation({
    mutationFn: (meal: MealInputs) =>
      upsertMeal({
        id: id,
        user_id: session.user.id,
        ...meal,
      }),
  });

  const onSubmit = async function (inputs: MealInputs) {
    setContext({
      busy: true,
      error: null,
    });

    let meal = null;
    let error = null;
    try {
      meal = await upsertMeal({
        id: id,
        user_id: session.user.id,
        name: inputs.name,
        notes: inputs.notes,
      });
    } catch (err) {
      error = getErrorMessage(err);
    }

    if (meal != null && isCreate) {
      navigate(`/meals/edit/${meal.id}`, { replace: true });
    }

    setContext({
      busy: false,
      error: error,
    });
  };

  const onDelete = async function () {
    setContext({
      busy: true,
      error: null,
    });

    let deleted = false;
    let error = null;
    try {
      deleted = await deleteMeal(id ?? "");
    } catch (err) {
      error = getErrorMessage(err);
    }

    if (deleted) {
      navigate("/meals", { replace: true });
    }

    setContext({
      busy: false,
      error: error,
    });
  };

  useEffect(() => {
    (async () => {
      let error = null;
      if (id != null) {
        try {
          const meal = await retrieveMeal(id);
          formMethods.reset({
            name: meal.name,
            notes: meal.notes ?? "",
          });
        } catch (err) {
          error = getErrorMessage(err);
        }
      }
      setContext({
        busy: false,
        error: error,
      });
    })();
  }, [formMethods, id]);

  return (
    <Page busy={context.busy} error={context.error}>
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
              disabled={context.busy || context.error != null}
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
      {!isCreate ? (
        <div>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => setConfirmDelete(true)}
            disabled={context.busy || context.error != null}
          >
            DELETE
          </Button>
          <Dialog maxWidth="sm" fullWidth={true} open={confirmDelete}>
            <DialogTitle>Delete meal?</DialogTitle>
            <DialogActions>
              <Button color="info" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button color="error" onClick={onDelete}>
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
