import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import produce from "immer";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { useGroceries } from "../../providers/providerGrocery";
import {
  useMeal,
  useMealDeleteMutation,
  useMealUpsertMutation,
} from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import GroceryEdit from "../groceries/GroceryEdit";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import CardTitle from "../items/CardTitle";
import Page, { combineStates, PageState } from "../Page";
import ScrollTop from "../ScrollTop";

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
  const navigate = useNavigate();
  const userid = useAtomValue(useridAtom);
  const [addGrocery, setAddGrocery] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [selectedGroceries, setSelectedGroceries] = useState<string[]>([]);

  const { id } = useParams();
  const isCreate: boolean = !(id != null);

  const formMethods = useForm<MealInputs>({
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  const groceries = useGroceries();

  const meal = useMeal({
    id: id ?? null,
    onSuccess: (meal) =>
      formMethods.reset({
        name: meal.name,
        notes: meal.notes ?? "",
      }),
  });

  const mealUpsert = useMealUpsertMutation({
    onSuccess: (id) => {
      if (isCreate) {
        navigate(`/meals/read/${id}`, { replace: true });
      } else {
        navigate(-1);
      }
    },
  });

  const mealDelete = useMealDeleteMutation({
    onSuccess: () => navigate("/meals", { replace: true }),
  });

  const handleAddGrocery = (id: string) => {
    if (selectedGroceries.indexOf(id) === -1) {
      setSelectedGroceries(
        produce(selectedGroceries, (draft) => {
          draft.push(id);
        })
      );
    }
  };

  const handleDeleteGrocery = (id: string) => {
    const index = selectedGroceries.indexOf(id);
    if (index !== -1) {
      setSelectedGroceries(
        produce(selectedGroceries, (draft) => {
          draft.splice(index, 1);
        })
      );
    }
  };

  const pageState: PageState = isCreate
    ? combineStates([groceries, mealUpsert])
    : combineStates([groceries, meal, mealUpsert, mealDelete]);

  return (
    <Page {...pageState}>
      <ScrollTop />
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((x) =>
            mealUpsert.mutate({
              id: id,
              user_id: userid,
              ...x,
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
              {isCreate ? "Create Meal" : "Edit Meal"}
            </Typography>
            <Button
              variant="contained"
              type="submit"
              disabled={pageState.isLoading || meal.isError}
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
                <CardTitle text="Summary" />
                <TextInput
                  name="name"
                  label="Name"
                  rules={formValidation.name}
                />
                <TextInput name="notes" label="Notes" multiline rows={20} />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <CardTitle text={`Groceries (${selectedGroceries.length})`} />
              <GroceriesRead
                groceries={groceries.data}
                ids={selectedGroceries}
                onDelete={handleDeleteGrocery}
              />
            </CardContent>
            <CardActions sx={{ py: 1, px: 2, flexDirection: "row-reverse" }}>
              <Button
                color="secondary"
                onClick={() => setAddGrocery(true)}
                disabled={pageState.isLoading || pageState.isError}
              >
                Add Grocery Item
              </Button>
            </CardActions>
          </Card>
        </form>
      </FormProvider>
      <GroceryEdit
        open={addGrocery}
        onDismiss={() => setAddGrocery(false)}
        onAddGrocery={handleAddGrocery}
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
            <DialogTitle>Delete meal?</DialogTitle>
            <DialogActions>
              <Button color="info" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button color="error" onClick={() => mealDelete.mutate(id ?? "")}>
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
