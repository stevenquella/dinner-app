import { Launch, LocalGroceryStore } from "@mui/icons-material";
import { IconButton, Link, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getMealsById, useMeals } from "../../providers/providerMeal";

export type MealsRelatedProps = {
  ids?: string[];
  linkTarget?: string;
};

export function MealsRelated(props: MealsRelatedProps) {
  const meals = useMeals();

  return (
    <List disablePadding>
      {getMealsById(meals.data, props.ids).map((meal) => (
        <ListItem
          key={meal.id}
          sx={{
            p: 1.5,
            mb: 1,
            border: 1,
            borderColor: "divider",
          }}
          secondaryAction={
            <Link component={RouterLink} to={`/meals/read/${meal.id}`} target={props.linkTarget}>
              <IconButton edge="end">
                <Launch />
              </IconButton>
            </Link>
          }
        >
          <ListItemText primary={meal.name} />
          {meal.meal_grocery.length > 0 ? (
            <ListItemIcon>
              <LocalGroceryStore fontSize="small" color="info" />
            </ListItemIcon>
          ) : null}
        </ListItem>
      ))}
      {props.ids?.length === 0 ? <ListItemText primary="No related meals." /> : null}
    </List>
  );
}
