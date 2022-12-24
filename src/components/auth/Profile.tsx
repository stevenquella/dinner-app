import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../App";
import { signOut } from "../../providers/authProvider";
import { getErrorMessage } from "../../providers/helpers";
import Page, { PageContext } from "../Page";

export default function Profile() {
  const [context, setContext] = useState<PageContext>({
    busy: false,
    error: null,
  });
  const { session } = useAppContext();

  const onLogout: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    setContext({
      busy: true,
      error: null,
    });

    let error: string | null = null;
    try {
      await signOut();
    } catch (err) {
      error = getErrorMessage(err);
    }

    setContext({
      busy: false,
      error: error,
    });
  };

  return (
    <Page {...context}>
      <Card sx={{ p: 1 }}>
        <CardContent>
          <Typography variant="body1">
            You are logged in as {session.user.email || "Huh?"}.
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="error" onClick={onLogout}>
            LOG OUT
          </Button>
        </CardActions>
      </Card>
    </Page>
  );
}
