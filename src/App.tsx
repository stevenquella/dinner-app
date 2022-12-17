import { Button, Grid, TextField, Typography } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import LogIn from "./components/auth/LogIn";
import LogOut from "./components/auth/LogOut";
import { supabase } from "./providers/client";

export default function App() {
  const [session, setSession] = useState<Session | null>();

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

  return <div>{session != null ? <LogOut /> : <LogIn />}</div>;
}
