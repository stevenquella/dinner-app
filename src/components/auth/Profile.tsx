import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../../App";
import { signOut } from "../../providers/authProvider";
import Page from "../Page";

export default function Profile() {
  const { session } = useAppContext();
  const logOutMutation = useMutation({
    mutationFn: () => signOut(),
  });

  return (
    <Page {...logOutMutation}>
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Typography variant="body1">
            You are logged in as {session.user.email || "Huh?"}.
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="error" onClick={() => logOutMutation.mutate()}>
            LOG OUT
          </Button>
        </CardActions>
      </Card>
    </Page>
  );
}
