import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { usePlanDeleteMutation } from "../../providers/providerPlan";

export default function PlanDelete() {
  const navigate = useNavigate();
  const { id } = useParams();
  const planDelete = usePlanDeleteMutation({
    onSuccess: () => navigate(`/`),
  });

  return (
    <Dialog maxWidth="sm" fullWidth={true} open={true}>
      <DialogTitle>Delete plan?</DialogTitle>
      <DialogActions>
        <Button color="info" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button color="error" onClick={() => planDelete.mutate(id ?? "")} disabled={planDelete.isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
