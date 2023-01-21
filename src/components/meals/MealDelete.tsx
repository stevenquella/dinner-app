import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useMealDeleteMutation } from "../../providers/providerMeal";

export default function MealDelete() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mealDelete = useMealDeleteMutation({
    onSuccess: () => navigate("/meals"),
  });

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={true}>
      <DialogTitle>Delete meal?</DialogTitle>
      <DialogContent>
        <Typography>Deleting this meal will remove it from any related plans.</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button color="error" onClick={() => mealDelete.mutate(id ?? "")} disabled={mealDelete.isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
