import { Button, Grid, TextField, Typography } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./providers/client";

export default function App() {
  const [session, setSession] = useState<Session | null>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const refreshSession = async () => {
    const latestSession = await supabase.auth.getSession();
    setSession(latestSession.data.session);
  };

  const onLogin: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.debug(response);
    setSession(response.data.session);
  };

  const onLogout: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setSession(null);
  };

  useEffect(() => {
    refreshSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {session != null ? (
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          rowSpacing={1}
          padding={1}
        >
          <Grid item>
            <Typography variant="body1">
              You are logged in, {session.user.id}.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" type="button" onClick={onLogout}>
              LOG OUT
            </Button>
          </Grid>
        </Grid>
      ) : (
        <div>
          <Typography variant="body1" padding={1}>
            You are NOT logged in.
          </Typography>

          <form onSubmit={onLogin}>
            <Grid
              container
              direction="column"
              alignItems="stretch"
              padding={1}
              rowSpacing={1}
            >
              <Grid item>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  autoComplete="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  autoComplete="current-password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>

              <Grid item>
                <Button variant="contained" type="submit">
                  LOG IN
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      )}
    </div>
  );
}
