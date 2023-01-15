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
} from "@mui/material";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useridAtom } from "../../providers/providerAuth";
import {
  usePlanMealUpsertMutation,
  usePlans,
} from "../../providers/providerPlan";
import { combineStates } from "../Page";

export type MealScheduleProps = {
  mealid: string;
  open: boolean;
  onDismiss: () => void;
};

export default function MealSchedule(props: MealScheduleProps) {
  const userid = useAtomValue(useridAtom);
  const plans = usePlans({
    start: dayjs().format("YYYY-MM-DD"),
  });
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const planMealUpsert = usePlanMealUpsertMutation({
    onSuccess: () => props.onDismiss(),
  });

  const dialogState = combineStates([plans, planMealUpsert]);

  return (
    <Dialog fullScreen open={props.open}>
      <DialogTitle>Select Plan</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {plans.isLoading || plans.isError ? <CircularProgress /> : null}
        <List>
          {plans.data?.map((plan) => (
            <ListItemButton
              key={plan.id}
              sx={{
                padding: 2,
                paddingLeft: 4,
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
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: "divider" }}>
        <Button color="info" size="large" onClick={() => props.onDismiss()}>
          Cancel
        </Button>
        <Button
          size="large"
          onClick={() =>
            planMealUpsert.mutate({
              user_id: userid,
              meal_id: props.mealid,
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
