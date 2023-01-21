import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useridAtom } from "../../providers/providerAuth";
import { usePlanMealUpsertMutation, usePlans } from "../../providers/providerPlan";
import { combineStates } from "../Page";

export default function MealSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userid = useAtomValue(useridAtom);
  const plans = usePlans({
    start: dayjs().format("YYYY-MM-DD"),
  });
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const planMealUpsert = usePlanMealUpsertMutation({
    onSuccess: () => navigate(-1),
  });

  const dialogState = combineStates([plans, planMealUpsert]);

  return (
    <Dialog fullScreen open={true}>
      <DialogTitle>Select Plan</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {plans.isLoading || plans.isError ? <CircularProgress /> : null}
        <List>
          {plans.data?.map((plan) => (
            <ListItemButton
              key={plan.id}
              sx={{
                p: 2,
                pl: 4,
                borderBottom: 1,
                borderColor: "divider",
              }}
              selected={selectedPlan === plan.id}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <ListItemText primary={plan.date} secondary={plan.notes} />
            </ListItemButton>
          ))}
        </List>
        {plans.data?.length === 0 ? (
          <Typography variant="body1" sx={{ pl: 3 }}>
            No future plans found.
          </Typography>
        ) : (
          <span></span>
        )}
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button color="info" size="large" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          size="large"
          onClick={() =>
            planMealUpsert.mutate({
              user_id: userid,
              meal_id: id ?? "",
              plan_id: selectedPlan ?? "",
            })
          }
          disabled={!selectedPlan || dialogState.isLoading}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
