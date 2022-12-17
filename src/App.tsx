import { Flatware, ListAlt, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import LogIn from "./components/auth/LogIn";
import LogOut from "./components/auth/LogOut";
import { supabase } from "./providers/client";

export default function App() {
  const [session, setSession] = useState<Session | null>();
  const [nav, setNav] = useState<string>("plans");

  const refreshSession = async () => {
    const latestSession = await supabase.auth.getSession();
    setSession(latestSession.data.session);
  };

  useEffect(() => {
    refreshSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {session != null ? <LogOut /> : <LogIn />}
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
    </div>
  );
}
