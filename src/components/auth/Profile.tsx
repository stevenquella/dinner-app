import { Button, Grid, Typography } from "@mui/material";
import { useAppContext } from "../../App";
import { supabase } from "../../providers/client";

export default function Profile() {
  const { session } = useAppContext();

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
      sx={{ py: 2 }}
    >
      <Grid item>
        <Typography variant="body1">
          You are logged in as {session.user.email || "N/A"}.
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" type="button" onClick={onLogout}>
          LOG OUT
        </Button>
      </Grid>
    </Grid>
  );
}
