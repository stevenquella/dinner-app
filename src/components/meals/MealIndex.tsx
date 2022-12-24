import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Page from "../Page";

export default function MealIndex() {
  return (
    <Page>
      <div>MEALS</div>
      <Link component={RouterLink} to="/meals/edit">
        CREATE MEAL
      </Link>
    </Page>
  );
}
