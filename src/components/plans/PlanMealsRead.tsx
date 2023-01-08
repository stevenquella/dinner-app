import { LocalGroceryStore, OpenInNew } from "@mui/icons-material";
import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getMealsById, Meal } from "../../providers/providerMeal";

export type PlanMealsReadProps = {
  meals?: Meal[];
  ids?: string[];
};

export function PlanMealsRead(props: PlanMealsReadProps) {
  return (
    <List disablePadding>
      {getMealsById(props.meals, props.ids).map((meal) => (
        <ListItem
          key={meal.id}
          sx={{
            p: 1.5,
            mb: 1,
            border: 1,
            borderColor: "divider",
          }}
          secondaryAction={
            <Link
              component={RouterLink}
              to={`/meals/read/${meal.id}`}
              target="_blank"
            >
              <IconButton edge="end">
                <OpenInNew />
              </IconButton>
            </Link>
          }
        >
          <ListItemText primary={meal.name} />
          {meal.meal_grocery.length > 0 ? (
            <ListItemIcon>
              <LocalGroceryStore fontSize="small" color="info" />{" "}
            </ListItemIcon>
          ) : null}
        </ListItem>
      ))}
    </List>
  );
}
