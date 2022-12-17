import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { supabase } from "../../providers/client";

export type LoginProps = {};

export default function LogIn(props: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLogin: React.FormEventHandler = async (e) => {
    e.preventDefault();

    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
  };

  return (
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
  );
}
