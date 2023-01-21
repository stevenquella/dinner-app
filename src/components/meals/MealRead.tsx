import { Box, Card, CardContent, Typography } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import { useGroceries } from "../../providers/providerGrocery";
import { useMeal } from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import ButtonLink from "../items/ButtonLink";
import CardTitle from "../items/CardTitle";
import UrlMatches from "../items/UrlMatches";
import Page, { combineStates } from "../Page";
import PlansRelated from "../plans/PlansRelated";
import ScrollTop from "../ScrollTop";

export default function MealRead() {
  const { id } = useParams();
  const groceries = useGroceries();
  const meal = useMeal({ id: id ?? null });
  const pageState = combineStates([groceries, meal]);

  return (
    <Page {...pageState}>
      <ScrollTop />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">{meal.data?.name}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <ButtonLink
            to={`/meals/edit/${id}`}
            variant="contained"
            disabled={pageState.isLoading || meal.isError}
            text="Edit"
          />
          <ButtonLink
            to="schedule"
            variant="contained"
            color="secondary"
            disabled={pageState.isLoading || meal.isError}
            text="Schedule"
          />
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Box>
            <CardTitle text="Summary" />
            <Typography variant="body1" whiteSpace="pre-wrap">
              {meal.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text="Links" />
          <UrlMatches text={meal.data?.notes} />
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Groceries (${meal.data?.meal_grocery.length ?? 0})`} />
          <GroceriesRead groceries={groceries.data} ids={meal.data?.meal_grocery.map((x) => x.grocery_id)} />
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Plans (${meal.data?.plan_meal.length ?? 0})`} />
          <PlansRelated ids={meal.data?.plan_meal.map((x) => x.plan_id)} />
        </CardContent>
      </Card>

      <Outlet />
    </Page>
  );
}
