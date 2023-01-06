import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useMeals } from "../../providers/providerMeal";
import { usePlan } from "../../providers/providerPlan";
import Page from "../Page";
import { PlanMealsRead } from "./PlanMealsRead";

export default function PlanRead() {
  const { id } = useParams();

  const plan = usePlan({
    id: id ?? null,
  });
  const meals = useMeals();

  return (
    <Page {...plan}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">{plan.data?.date}</Typography>

        <Link component={RouterLink} to={`/plans/edit/${id}`}>
          <Button variant="contained" disabled={plan.isLoading || plan.isError}>
            Edit
          </Button>
        </Link>
      </Box>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 1,
            }}
          >
            <Typography variant="caption">Summary</Typography>

            <Typography variant="body1" whiteSpace="pre-wrap">
              {plan.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Typography variant="caption">Meals</Typography>
          <PlanMealsRead
            meals={meals.data}
            ids={plan.data?.plan_meal.map((x) => x.meal_id)}
          />
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Typography variant="caption">Groceries</Typography>
        </CardContent>
      </Card>
    </Page>
  );
}
