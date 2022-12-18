import { RouteObject } from "react-router-dom";
import App from "./App";
import Profile from "./components/auth/Profile";
import Error from "./components/Error";
import MealIndex from "./components/meals/MealIndex";
import PlanIndex from "./components/plans/PlanIndex";

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
        path: "meals",
        element: <MealIndex />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];
