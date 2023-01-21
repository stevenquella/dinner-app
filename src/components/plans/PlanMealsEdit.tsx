import { LocalGroceryStore } from "@mui/icons-material";
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
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { getMealsById, useMeals } from "../../providers/providerMeal";
import { planMealsAtom } from "./PlanEdit";

export default function PlanMealsEdit() {
  const navigate = useNavigate();
  const meals = useMeals();
  const [selectedMeals, setSelectedMeals] = useAtom(planMealsAtom);

  const handleSelect = (id: string) => {
    const index = selectedMeals.indexOf(id);

    setSelectedMeals(
      produce(selectedMeals, (draft) => {
        if (index === -1) {
          draft.push(id);
        } else {
          draft.splice(index, 1);
        }
      })
    );
  };

  const handleDelete = (id: string) => {
    const index = selectedMeals.indexOf(id);
    if (index !== -1) {
      setSelectedMeals(
        produce(selectedMeals, (draft) => {
          draft.splice(index, 1);
        })
      );
    }
  };

  return (
    <Dialog open={true} fullScreen>
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
        Select Meals
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {getMealsById(meals.data, selectedMeals).map((meal) => (
            <Chip key={meal.id} label={meal.name} onDelete={() => handleDelete(meal.id)} />
          ))}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {meals.isLoading || meals.isError ? <CircularProgress /> : null}
        <List>
          {meals.data?.map((x) => (
            <ListItemButton
              key={x.id}
              sx={{
                padding: 2,
                paddingLeft: 4,
                borderBottom: 1,
                borderColor: "divider",
              }}
              selected={selectedMeals.indexOf(x.id) !== -1}
              onClick={() => handleSelect(x.id)}
            >
              <ListItemText primary={x.name} />
              {x.meal_grocery.length > 0 ? <LocalGroceryStore fontSize="small" color="info" /> : null}
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button size="large" color="warning" onClick={() => setSelectedMeals([])}>
          Clear
        </Button>
        <Button size="large" onClick={() => navigate(-1)}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
