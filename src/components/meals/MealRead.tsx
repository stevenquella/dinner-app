import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink, useParams } from "react-router-dom";
import { mealQueryKeys, retrieveMeal } from "../../providers/providerMeal";
import Page from "../Page";

export default function MealRead() {
  const { id } = useParams();
  const mealQuery = useQuery({
    queryKey: [mealQueryKeys.meal, id],
    queryFn: () => retrieveMeal(id ?? ""),
  });

  return (
    <Page {...mealQuery}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">{mealQuery.data?.name}</Typography>

        <Link component={RouterLink} to={`/meals/edit/${id}`}>
          <Button
            variant="contained"
            disabled={mealQuery.isLoading || mealQuery.isError}
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
            <Typography variant="body1" whiteSpace="pre-wrap">
              {mealQuery.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Typography variant="body1">Groceries</Typography>
        </CardContent>
      </Card>
    </Page>
  );
}
