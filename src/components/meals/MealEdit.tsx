import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import produce from "immer";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { useGroceries } from "../../providers/providerGrocery";
import { useMeal, useMealUpsertMutation } from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import ButtonLink from "../items/ButtonLink";
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

export const mealGroceriesAtom = atom<string[]>([]);

export default function MealEdit() {
  const navigate = useNavigate();
  const userid = useAtomValue(useridAtom);

  const { id } = useParams();
  const isCreate: boolean = !(id != null);

  const groceries = useGroceries();

  const meal = useMeal({
    id: id ?? null,
    onSuccess: (meal) => {
      formMethods.reset({
        name: meal.name,
        notes: meal.notes ?? "",
      });
      setSelectedGroceries(meal.meal_grocery.map((x) => x.grocery_id));
    },
  });

  const formMethods = useForm<MealInputs>({
    defaultValues: {
      name: meal.data?.name ?? "",
      notes: meal.data?.notes ?? "",
    },
  });

  const [selectedGroceries, setSelectedGroceries] = useAtom(mealGroceriesAtom);

  const mealUpsert = useMealUpsertMutation({
    onSuccess: (id) => {
      if (isCreate) {
        navigate(`/meals/read/${id}`, { replace: true });
      } else {
        navigate(-1);
      }
    },
  });

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

  useEffect(() => {
    setSelectedGroceries(meal.data?.meal_grocery?.map((x) => x.grocery_id) ?? []);
  }, [meal.data?.meal_grocery, setSelectedGroceries]);

  const pageState: PageState = isCreate
    ? combineStates([groceries, mealUpsert])
    : combineStates([groceries, meal, mealUpsert]);

  return (
    <Page {...pageState}>
      <ScrollTop />
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((x) =>
            mealUpsert.mutate({
              meal: {
                id: id,
                user_id: userid,
                ...x,
              },
              groceries: selectedGroceries,
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
            <Typography variant="h5">{isCreate ? "Create Meal" : "Edit Meal"}</Typography>
            <Button variant="contained" type="submit" disabled={pageState.isLoading || meal.isError}>
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
                <TextInput name="name" label="Name" rules={formValidation.name} />
                <TextInput name="notes" label="Notes" multiline rows={20} />
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <CardTitle text={`Groceries (${selectedGroceries.length})`} />
              <GroceriesRead groceries={groceries.data} ids={selectedGroceries} onDelete={handleDeleteGrocery} />
            </CardContent>
            <CardActions sx={{ py: 1, px: 2, flexDirection: "row-reverse" }}>
              <ButtonLink
                color="secondary"
                to="groceries"
                disabled={pageState.isLoading || pageState.isError}
                text="Add Groceries"
              />
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
        <div></div>
      )}

      <Outlet />
    </Page>
  );
}
