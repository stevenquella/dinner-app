import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getErrorMessage } from "../../providers/helpers";
import { Meal, retrieveMeals } from "../../providers/mealsProvider";
import Page, { PageContext } from "../Page";

export default function MealIndex() {
  const [context, setContext] = useState<PageContext>({
    busy: true,
    error: null,
  });
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    (async () => {
      let error: string | null = null;
      try {
        const meals = await retrieveMeals();
        setMeals(meals);
      } catch (err) {
        error = getErrorMessage(err);
      }

      setContext({
        busy: false,
        error: error,
      });
    })();
  }, []);

  return (
    <Page {...context}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">Meals</Typography>
        <Link component={RouterLink} to="/meals/edit">
          <Button variant="contained" size="small">
            Create Meal
          </Button>
        </Link>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {meals.map((meal) => (
          <Link
            component={RouterLink}
            to={`/meals/edit/${meal.id}`}
            underline="none"
          >
            <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
              <CardActionArea>
                <CardContent>{meal.name}</CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </Box>
    </Page>
  );
}
