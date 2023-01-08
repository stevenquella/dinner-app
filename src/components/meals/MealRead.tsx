import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGroceries } from "../../providers/providerGrocery";
import { useMeal } from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import CardTitle from "../items/CardTitle";
import Page, { combineStates } from "../Page";

export default function MealRead() {
  const { id } = useParams();
  const groceries = useGroceries();
  const meal = useMeal({ id: id ?? null });
  const pageState = combineStates([groceries, meal]);

  return (
    <Page {...pageState}>
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

        <Link component={RouterLink} to={`/meals/edit/${id}`}>
          <Button
            variant="contained"
            disabled={pageState.isLoading || meal.isError}
          >
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
            <CardTitle text="Summary" />
            <Typography variant="body1" whiteSpace="pre-wrap">
              {meal.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <CardTitle text={`Groceries (${meal.data?.meal_grocery.length})`} />
          <GroceriesRead
            groceries={groceries.data}
            ids={meal.data?.meal_grocery.map((x) => x.grocery_id)}
          />
        </CardContent>
      </Card>
    </Page>
  );
}
