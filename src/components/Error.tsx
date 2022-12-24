import { Alert, Container } from "@mui/material";
import { useRouteError } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Error() {
  const error: any = useRouteError();
  const errorMessage = error.statusText || error.message;

  return (
    <div>
      <Header />
      <Container fixed sx={{ py: 2 }}>
        {errorMessage != null ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : null}
      </Container>
      <Footer />
    </div>
  );
}
