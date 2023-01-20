import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { sessionAtom, useSignOutMutation } from "../../providers/providerAuth";
import Page from "../Page";

export default function Profile() {
  const session = useAtomValue(sessionAtom);
  const signOut = useSignOutMutation();

  return (
    <Page {...signOut}>
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Typography variant="body1">You are logged in as {session?.user.email ?? "Huh?"}.</Typography>
        </CardContent>
        <CardActions>
          <Button color="error" onClick={() => signOut.mutate()}>
            LOG OUT
          </Button>
        </CardActions>
      </Card>
    </Page>
  );
}
