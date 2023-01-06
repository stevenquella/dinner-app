import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useMeal } from "../../providers/providerMeal";
import GroceriesRead from "../groceries/GroceriesRead";
import Page from "../Page";

export default function MealRead() {
  const { id } = useParams();
  const meal = useMeal({ id: id ?? null });

  return (
    <Page {...meal}>
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
          <Button variant="contained" disabled={meal.isLoading || meal.isError}>
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
              {meal.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body1" fontWeight="light">
              Groceries
            </Typography>
          </Box>

          <GroceriesRead />
        </CardContent>
      </Card>
    </Page>
  );
}
