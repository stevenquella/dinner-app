import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function MealIndex() {
  return (
    <div>
      MEALS
      <Link component={RouterLink} to="/meals/edit">
        CREATE MEAL
      </Link>
    </div>
  );
}
