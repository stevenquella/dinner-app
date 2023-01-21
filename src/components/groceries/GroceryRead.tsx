import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGrocery } from "../../providers/providerGrocery";
import { MealsRelated } from "../meals/MealsRelated";

export default function GroceryRead() {
  const navigate = useNavigate();
  const { id } = useParams();
  const grocery = useGrocery(id ?? "");

  return (
    <Dialog keepMounted maxWidth="sm" fullWidth={true} open={true}>
      <DialogTitle>{grocery.data?.name ?? "Loading..."}</DialogTitle>
      <DialogContent>
        {grocery.isLoading ? <CircularProgress /> : null}
        <MealsRelated ids={grocery.data?.meal_grocery.map((x) => x.meal_id)} />
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={() => navigate(-1)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
