import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { mealQueryKeys, retrieveMeals } from "../../providers/mealsProvider";
import SearchInput from "../inputs/SearchInput";
import HighlightText from "../items/HighlightText";
import Page from "../Page";

export default function MealIndex() {
  const [search, setSearch] = useState<string>("");
  const meals = useQuery({
    queryKey: [mealQueryKeys.meals, search],
    queryFn: () => retrieveMeals(search),
  });

  return (
    <Page {...meals}>
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
        <SearchInput
          name="search"
          placeholder="Search meals..."
          onChange={setSearch}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {meals.data?.map((meal) => (
          <Link
            key={meal.id}
            component={RouterLink}
            to={`/meals/edit/${meal.id}`}
            underline="none"
          >
            <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1">
                    <HighlightText search={search} text={meal.name} />
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </Box>
      {meals.data?.length === 0 ? (
        <Typography variant="body1">No meals found.</Typography>
      ) : (
        <span></span>
      )}
    </Page>
  );
}
