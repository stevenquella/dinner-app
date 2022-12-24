import { Container } from "@mui/material";
import { useRouteError } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import Footer from "./Footer";
import Header from "./Header";

export default function Error() {
  const error: any = useRouteError();

  return (
    <div>
      <Header />
      <Container fixed sx={{ py: 2 }}>
        <ErrorAlert error={error.statusText || error.message} />
      </Container>
      <Footer />
    </div>
  );
}
