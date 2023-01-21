import { Flatware, ListAlt, LocalGroceryStore, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const [nav, setNav] = useState<string>();

  useEffect(() => {
    setNav(location.pathname);
  }, [location]);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <BottomNavigation value={nav} onChange={(_event, newValue) => setNav(newValue)}>
        <BottomNavigationAction component={RouterLink} to="/" label="Meal Plans" value="/" icon={<ListAlt />} />
        <BottomNavigationAction component={RouterLink} to="meals" label="Meals" value="/meals" icon={<Flatware />} />
        <BottomNavigationAction
          component={RouterLink}
          to="groceries"
          label="Groceries"
          value="/groceries"
          icon={<LocalGroceryStore />}
        />
        <BottomNavigationAction
          component={RouterLink}
          to="profile"
          label="Profile"
          value="/profile"
          icon={<Person />}
        />
      </BottomNavigation>
    </Paper>
  );
}
