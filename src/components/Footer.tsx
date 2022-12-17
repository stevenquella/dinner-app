import { Flatware, ListAlt, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";

export default function Footer() {
  const [nav, setNav] = useState<string>("plans");

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={nav}
        onChange={(_event, newValue) => setNav(newValue)}
      >
        <BottomNavigationAction
          label="Meal Plans"
          value="plans"
          icon={<ListAlt />}
        />
        <BottomNavigationAction
          label="Meals"
          value="meals"
          icon={<Flatware />}
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<Person />}
        />
      </BottomNavigation>
    </Paper>
  );
}
