import { RouteObject } from "react-router-dom";
import App from "./App";
import Profile from "./components/auth/Profile";
import Error from "./components/Error";
import GroceryIndex from "./components/groceries/GroceryIndex";
import GroceryRead from "./components/groceries/GroceryRead";
import MealDelete from "./components/meals/MealDelete";
import MealEdit from "./components/meals/MealEdit";
import MealGroceryEdit from "./components/meals/MealGroceryEdit";
import MealIndex from "./components/meals/MealIndex";
import MealRead from "./components/meals/MealRead";
import MealSchedule from "./components/meals/MealSchedule";
import PlanDelete from "./components/plans/PlanDelete";
import PlanEdit from "./components/plans/PlanEdit";
import PlanIndex from "./components/plans/PlanIndex";
import PlanMealsEdit from "./components/plans/PlanMealsEdit";
import PlanRead from "./components/plans/PlanRead";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <PlanIndex />,
      },
      {
        path: "plans/edit/:id?",
        element: <PlanEdit />,
        children: [
          {
            path: "meals",
            element: <PlanMealsEdit />,
          },
          {
            path: "delete",
            element: <PlanDelete />,
          },
        ],
      },
      {
        path: "plans/read/:id",
        element: <PlanRead />,
      },
      {
        path: "meals",
        element: <MealIndex />,
      },
      {
        path: "meals/edit/:id?",
        element: <MealEdit />,
        children: [
          {
            path: "delete",
            element: <MealDelete />,
          },
          {
            path: "groceries",
            element: <MealGroceryEdit />,
          },
        ],
      },
      {
        path: "meals/read/:id",
        element: <MealRead />,
        children: [
          {
            path: "schedule",
            element: <MealSchedule />,
          },
        ],
      },
      {
        path: "groceries",
        element: <GroceryIndex />,
        children: [
          {
            path: ":id",
            element: <GroceryRead />,
          },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];
