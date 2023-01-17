import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { usePlanGroceries } from "../../providers/providerGrocery";
import { usePlan } from "../../providers/providerPlan";
import GroceriesRead from "../groceries/GroceriesRead";
import CardTitle from "../items/CardTitle";
import { MealsRelated } from "../meals/MealsRelated";
import Page, { combineStates } from "../Page";
import ScrollTop from "../ScrollTop";

export default function PlanRead() {
  const { id } = useParams();

  const plan = usePlan({
    id: id ?? null,
  });
  const planGroceries = usePlanGroceries(
    id ?? "",
    plan.data?.plan_meal.map((x) => x.meal_id) ?? [],
    id != null && !!plan.data
  );

  const pageState = combineStates([plan, planGroceries]);

  const handleShare = async () => {
    await navigator?.share({
      url: window.location.href,
    });
  };

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
        <Typography variant="h5">{plan.data?.date}</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Link component={RouterLink} to={`/plans/edit/${id}`}>
            <Button
              variant="contained"
              disabled={pageState.isLoading || plan.isError}
            >
              Edit
            </Button>
          </Link>
          {!!navigator.share ? (
            <Button
              variant="contained"
              color="secondary"
              disabled={pageState.isLoading || plan.isError}
              onClick={() => handleShare()}
            >
              Share
            </Button>
          ) : null}
        </Box>
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
            <CardTitle text="Summary" />
            <Typography variant="body1" whiteSpace="pre-wrap">
              {plan.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Meals (${plan.data?.plan_meal.length})`} />
          <MealsRelated ids={plan.data?.plan_meal.map((x) => x.meal_id)} />
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Groceries (${planGroceries.data?.length})`} />
          <GroceriesRead
            groceries={planGroceries.data}
            ids={planGroceries.data?.map((x) => x.id)}
            showCount
          />
        </CardContent>
      </Card>
    </Page>
  );
}
