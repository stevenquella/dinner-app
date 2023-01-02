import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { Link as RouterLink } from "react-router-dom";
import { mealsSearchAtom, mealsSearchQueryAtom } from "../../providers/store";
import SearchInput from "../inputs/SearchInput";
import HighlightText from "../items/HighlightText";
import Page from "../Page";

export default function MealIndex() {
  const [mealSearch, setMealSearch] = useAtom(mealsSearchAtom);
  const [meals] = useAtom(mealsSearchQueryAtom);

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
          defaultValue={mealSearch}
          onChange={setMealSearch}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {meals.data?.map((meal) => (
          <Link
            key={meal.id}
            component={RouterLink}
            to={`/meals/read/${meal.id}`}
            underline="none"
          >
            <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1">
                    <HighlightText search={mealSearch} text={meal.name} />
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
