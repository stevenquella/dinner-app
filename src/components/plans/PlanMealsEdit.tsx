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
import { getMealsById, useMeals } from "../../providers/providerMeal";

export type PlanMealsProps = {
  open: boolean;
  onDismiss: () => void;

  selectedMeals: string[];
  onChangeSelectedMeals: (items: string[]) => void;
};

export default function PlanMealsEdit(props: PlanMealsProps) {
  const meals = useMeals();

  const handleSelect = (id: string) => {
    const index = props.selectedMeals.indexOf(id);

    props.onChangeSelectedMeals(
      produce(props.selectedMeals, (draft) => {
        if (index === -1) {
          draft.push(id);
        } else {
          draft.splice(index, 1);
        }
      })
    );
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
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {getMealsById(meals.data, props.selectedMeals).map((meal) => (
            <Chip
              key={meal.id}
              label={meal.name}
              onDelete={() => handleDelete(meal.id)}
            />
          ))}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {meals.isLoading || meals.isError ? (
          <CircularProgress />
        ) : (
          <List>
            {meals.data.map((x) => (
              <ListItemButton
                key={x.id}
                sx={{
                  padding: 2,
                  paddingLeft: 4,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
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
        <Button
          size="large"
          color="warning"
          onClick={() => props.onChangeSelectedMeals([])}
        >
          Clear
        </Button>
        <Button size="large" onClick={() => props.onDismiss()}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
