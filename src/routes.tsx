import { RouteObject } from "react-router-dom";
import App from "./App";
import Profile from "./components/auth/Profile";
import Error from "./components/Error";
import GroceryIndex from "./components/groceries/GroceryIndex";
import MealEdit from "./components/meals/MealEdit";
import MealIndex from "./components/meals/MealIndex";
import MealRead from "./components/meals/MealRead";
import PlanEdit from "./components/plans/PlanEdit";
import PlanIndex from "./components/plans/PlanIndex";
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
      },
      {
        path: "meals/read/:id",
        element: <MealRead />,
      },
      {
        path: "groceries",
        element: <GroceryIndex />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];
