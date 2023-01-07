import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  GroceryCategory,
  groceryCategorySelect,
} from "../../providers/providerGrocery";
import AutocompleteInput from "../inputs/AutocompleteInput";
import SelectInput from "../inputs/SelectInput";

export type GroceryEditProps = {
  open: boolean;
  onDismiss: () => void;
};

type GroceryInputs = {
  category: GroceryCategory;
  name: string;
};

export default function GroceryEdit(props: GroceryEditProps) {
  const formMethods = useForm<GroceryInputs>({
    defaultValues: {
      category: "Produce",
      name: "asodifm",
    },
  });

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={props.open}>
      <DialogTitle>Add Grocery Item</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <FormProvider {...formMethods}>
            <form>
              <Stack spacing={1}>
                <SelectInput
                  name="category"
                  label="Category"
                  values={groceryCategorySelect}
                />
                <AutocompleteInput name="name" label="Name" options={[]} />
              </Stack>
            </form>
          </FormProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={() => props.onDismiss()}>
          Cancel
        </Button>
        <Button color="primary" onClick={() => props.onDismiss()}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
