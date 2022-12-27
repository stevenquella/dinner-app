import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "../../providers/providerAuth";
import useStore from "../../providers/store";
import Page from "../Page";

export default function Profile() {
  const session = useStore((state) => state.session);
  const logOutMutation = useMutation({
    mutationFn: () => signOut(),
  });

  return (
    <Page {...logOutMutation}>
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Typography variant="body1">
            You are logged in as {session?.user.email ?? "Huh?"}.
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
