import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { signOut } from "../../providers/providerAuth";
import { sessionAtom } from "../../providers/store";
import Page from "../Page";

export default function Profile() {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const logOutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => queryClient.invalidateQueries(),
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
