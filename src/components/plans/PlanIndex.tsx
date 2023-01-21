import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import dayjs from "dayjs";
import { atom, useAtom } from "jotai";
import { getSearchRange, usePlans } from "../../providers/providerPlan";
import SearchInput from "../inputs/SearchInput";
import ButtonLink from "../items/ButtonLink";
import CardTitle from "../items/CardTitle";
import { MealsRelated } from "../meals/MealsRelated";
import Page from "../Page";

const plansSearchAtom = atom(dayjs().format("YYYY-MM-DD"));

export default function PlanIndex() {
  const [plansSearch, setPlansSearch] = useAtom(plansSearchAtom);
  const range = getSearchRange(plansSearch);
  const plans = usePlans(range);

  let searchText;
  if (range) {
    searchText = `Showing plans from ${range.start} to ${range.end}.`;
  }

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
        <ButtonLink variant="contained" size="small" to="/plans/edit" text="Create Plan" />
        <SearchInput
          name="search"
          label="Search plans..."
          type="date"
          defaultValue={plansSearch}
          onChange={setPlansSearch}
          helperText={searchText}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {plans.data?.map((plan) => (
          <Card key={plan.id} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <CardContent>
              <CardTitle text={`${plan.date}${plan.notes ? `, ${plan.notes}` : ""}`} />
              <MealsRelated ids={plan.plan_meal.map((x) => x.meal_id)} />
            </CardContent>
            <CardActions sx={{ flexDirection: "row-reverse" }}>
              <ButtonLink color="secondary" to={`/plans/read/${plan.id}`} text="Open" />
            </CardActions>
          </Card>
        ))}
      </Box>
      {plans.data?.length === 0 ? <Typography variant="body1">No plans found.</Typography> : <span></span>}
    </Page>
  );
}
