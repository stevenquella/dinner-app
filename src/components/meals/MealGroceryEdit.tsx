import { Box, Button, Dialog, DialogTitle, Typography } from "@mui/material";
import produce from "immer";
import { useAtom, useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import {
  GroceryCategory,
  groceryCategorySelect,
  useGroceries,
  useGroceryUpsertMutation,
} from "../../providers/providerGrocery";
import AutocompleteInput from "../inputs/AutocompleteInput";
import SelectInput from "../inputs/SelectInput";
import { InputValidation } from "../inputs/types";
import { combineStates } from "../Page";
import { mealGroceriesAtom } from "./MealEdit";

type GroceryInputs = {
  category: GroceryCategory;
  name: string;
};

type GroceryValidation = {
  [prop in keyof GroceryInputs]?: InputValidation;
};

const formValidation: GroceryValidation = {
  category: {
    required: {
      value: true,
      message: "Category is required.",
    },
  },
  name: {
    required: {
      value: true,
      message: "Name is required.",
    },
  },
};

export default function MealGroceryEdit() {
  const navigate = useNavigate();
  const userid = useAtomValue(useridAtom);
  const groceries = useGroceries();
  const [selectedGroceries, setSelectedGroceries] = useAtom(mealGroceriesAtom);

  const formMethods = useForm<GroceryInputs>({
    defaultValues: {
      category: "Produce",
      name: "",
    },
  });

  const currentCategory = formMethods.watch("category");
  const currentName = formMethods.watch("name");

  const groceryUpsert = useGroceryUpsertMutation({
    onSuccess: (g) => {
      const index = selectedGroceries.indexOf(g.id);
      setSelectedGroceries(
        produce(selectedGroceries, (draft) => {
          if (index === -1) {
            draft.push(g.id);
          }
        })
      );

      formMethods.reset({
        category: currentCategory,
        name: "",
      });
    },
  });

  const existingGrocery = groceries.data?.find(
    (x) =>
      x.category?.toLowerCase() === currentCategory?.trim().toLowerCase() &&
      x.name?.toLowerCase() === currentName?.trim().toLowerCase()
  );

  const options: string[] = groceries.data?.filter((x) => x.category === currentCategory).map((x) => x.name) ?? [];

  const dialogState = combineStates([groceries, groceryUpsert]);

  return (
    <Dialog keepMounted maxWidth="sm" fullWidth={true} open={true}>
      <DialogTitle>Add Grocery Item</DialogTitle>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit((x) =>
            groceryUpsert.mutate({
              id: existingGrocery?.id,
              user_id: userid,
              ...x,
            })
          )}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              px: 3,
              py: 1,
            }}
          >
            <SelectInput
              name="category"
              label="Category"
              values={groceryCategorySelect}
              rules={formValidation.category}
            />
            <AutocompleteInput name="name" label="Name" options={options} rules={formValidation.name} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "center",
              gap: 1,
              mt: 2,
              p: 1,
            }}
          >
            <Button type="submit" color="primary" disabled={dialogState.isLoading || dialogState.isError}>
              Add
            </Button>
            <Button color="info" onClick={() => navigate(-1)}>
              Close
            </Button>
            <Typography variant="caption" sx={{ pl: 2, flexGrow: 1 }}>
              {existingGrocery ? "Exists" : "New"}
            </Typography>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
}
