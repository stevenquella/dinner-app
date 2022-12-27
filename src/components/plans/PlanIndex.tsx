import { Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function PlanIndex() {
  return (
    <div>
      PLANS{" "}
      <Link component={RouterLink} to="/plans/edit">
        <Button variant="contained" size="small">
          Create Plan
        </Button>
      </Link>
    </div>
  );
}
