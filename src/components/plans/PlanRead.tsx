import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePlan } from "../../providers/providerPlan";
import GroceriesRead from "../groceries/GroceriesRead";
import ButtonLink from "../items/ButtonLink";
import CardTitle from "../items/CardTitle";
import { MealsRelated } from "../meals/MealsRelated";
import Page, { combineStates } from "../Page";
import ScrollTop from "../ScrollTop";

export default function PlanRead() {
  const { id } = useParams();

  const plan = usePlan({
    id: id ?? null,
  });

  const pageState = combineStates([plan]);

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
          <ButtonLink
            to={`/plans/edit/${id}`}
            variant="contained"
            disabled={pageState.isLoading || plan.isError}
            text="Edit"
          />

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
          <CardTitle text={`Meals (${plan.data?.plan_meal.length ?? 0})`} />
          <MealsRelated ids={plan.data?.plan_meal.map((x) => x.meal_id)} />
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Groceries (${plan.data?.groceries?.length ?? 0})`} />
          <GroceriesRead groceries={plan.data?.groceries} ids={plan.data?.groceries?.map((x) => x.id)} showCount />
        </CardContent>
      </Card>
    </Page>
  );
}
