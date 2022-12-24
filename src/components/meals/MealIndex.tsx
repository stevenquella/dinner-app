import { Link } from "@mui/material";
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
      <div>MEALS</div>
      <Link component={RouterLink} to="/meals/edit">
        CREATE MEAL
      </Link>
      <div>
        {meals.map((x) => (
          <div>
            <Link component={RouterLink} to={`/meals/edit/${x.id}`}>
              {x.name}
            </Link>
          </div>
        ))}
      </div>
    </Page>
  );
}
