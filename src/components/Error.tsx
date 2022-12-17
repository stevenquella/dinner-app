import { Container, Grid, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Error() {
  const error: any = useRouteError();

  return (
    <div>
      <Header />
      <Container fixed>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignContent="center"
          rowSpacing={2}
          padding={4}
        >
          <Grid item>
            <Typography variant="body1" align="center">
              Something went wrong.
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption" align="center">
              {error.statusText || error.message}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}
