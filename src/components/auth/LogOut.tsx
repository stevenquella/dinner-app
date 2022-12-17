import { Button, Grid, Typography } from "@mui/material";
import { supabase } from "../../providers/client";

export default function LogOut() {
  const onLogout: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      rowSpacing={1}
      padding={1}
    >
      <Grid item>
        <Typography variant="body1">You are logged in.</Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" type="button" onClick={onLogout}>
          LOG OUT
        </Button>
      </Grid>
    </Grid>
  );
}
