import { Box, Button, Card, CardContent, Link, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGroceries } from "../../providers/providerGrocery";
import { useMeal } from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import CardTitle from "../items/CardTitle";
import UrlMatches from "../items/UrlMatches";
import Page, { combineStates } from "../Page";
import PlansRelated from "../plans/PlansRelated";
import ScrollTop from "../ScrollTop";
import MealSchedule from "./MealSchedule";

export default function MealRead() {
  const { id } = useParams();
  const groceries = useGroceries();
  const meal = useMeal({ id: id ?? null });
  const pageState = combineStates([groceries, meal]);
  const [scheduleMeal, setScheduleMeal] = useState<boolean>(false);

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
          <Link component={RouterLink} to={`/meals/edit/${id}`}>
            <Button variant="contained" disabled={pageState.isLoading || meal.isError}>
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="secondary"
            disabled={pageState.isLoading || meal.isError}
            onClick={() => setScheduleMeal(true)}
          >
            Schedule
          </Button>
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
      <MealSchedule mealid={id ?? ""} open={scheduleMeal} onDismiss={() => setScheduleMeal(false)} />
    </Page>
  );
}
