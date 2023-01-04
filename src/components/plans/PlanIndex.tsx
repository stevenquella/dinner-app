import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { Link as RouterLink } from "react-router-dom";
import {
  plansSearchAtom,
  plansSearchQueryAtom,
} from "../../providers/providerPlan";
import SearchInput from "../inputs/SearchInput";
import Page from "../Page";

export default function PlanIndex() {
  const [plansSearch, setPlansSearch] = useAtom(plansSearchAtom);
  const [plans] = useAtom(plansSearchQueryAtom);

  return (
    <Page {...plans}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">Plans</Typography>
        <Link component={RouterLink} to="/plans/edit">
          <Button variant="contained" size="small">
            Create Plan
          </Button>
        </Link>
        <SearchInput
          name="search"
          label="Search plans..."
          type="date"
          defaultValue={plansSearch}
          onChange={setPlansSearch}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {plans.data?.map((plan) => (
          <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
            <CardContent>
              <Typography variant="body1">
                {plan.date}
                {plan.notes ? `, ${plan.notes}` : ""}
              </Typography>
            </CardContent>
            <CardActions sx={{ flexDirection: "row-reverse" }}>
              <Link
                key={plan.id}
                component={RouterLink}
                to={`/plans/read/${plan.id}`}
                underline="none"
              >
                <Button color="secondary">Open</Button>
              </Link>
            </CardActions>
          </Card>
        ))}
      </Box>
      {plans.data?.length === 0 ? (
        <Typography variant="body1">No plans found.</Typography>
      ) : (
        <span></span>
      )}
    </Page>
  );
}
