import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../App";
import { supabase } from "../../providers/client";

export default function Profile() {
  const { session } = useAppContext();

  const onLogout: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
  };

  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="body1">
          You are logged in as {session.user.email || "N/A"}.
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="error" onClick={onLogout}>
          LOG OUT
        </Button>
      </CardActions>
    </Card>
  );
}
