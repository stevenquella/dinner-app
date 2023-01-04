import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import produce from "immer";
import { useMeals } from "../../providers/providerMeal";

export type PlanMealsProps = {
  open: boolean;
  onDismiss: () => void;

  selectedMeals: string[];
  onChangeSelectedMeals: (items: string[]) => void;
};

export default function PlanMeals(props: PlanMealsProps) {
  const meals = useMeals();

  const handleSelect = (id: string) => {
    const index = props.selectedMeals.indexOf(id);
    if (index === -1) {
      props.onChangeSelectedMeals(
        produce(props.selectedMeals, (draft) => {
          draft.push(id);
        })
      );
    }
  };

  const handleDelete = (id: string) => {
    const index = props.selectedMeals.indexOf(id);
    if (index !== -1) {
      props.onChangeSelectedMeals(
        produce(props.selectedMeals, (draft) => {
          draft.splice(index, 1);
        })
      );
    }
  };

  return (
    <Dialog open={props.open} fullScreen>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        Select Meals
        <Box sx={{ mt: 1 }}>
          {props.selectedMeals.map((id) => {
            const meal = meals.data?.find((x) => x.id === id);
            if (meal) {
              return (
                <Chip
                  key={id}
                  label={meal.name}
                  onDelete={() => handleDelete(id)}
                />
              );
            } else {
              return null;
            }
          })}
        </Box>
      </DialogTitle>
      <DialogContent>
        {meals.isLoading || meals.isError ? (
          <CircularProgress />
        ) : (
          <List>
            {meals.data.map((x) => (
              <ListItemButton
                key={x.id}
                sx={{ padding: 2, borderBottom: 1, borderColor: "divider" }}
                selected={props.selectedMeals.indexOf(x.id) !== -1}
                onClick={() => handleSelect(x.id)}
              >
                <ListItemText primary={x.name} />
              </ListItemButton>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button size="large" onClick={() => props.onDismiss()}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
