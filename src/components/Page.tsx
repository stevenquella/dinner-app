import { Alert, Container, LinearProgress } from "@mui/material";
import { getErrorMessage } from "../providers/helpers";

export type PageProps = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown | any;
  children?: JSX.Element | JSX.Element[];
};

export default function Page(props: PageProps) {
  return (
    <div>
      {" "}
      {props.isLoading ? <LinearProgress color="secondary" /> : null}
      <Container fixed sx={{ py: 2, mb: 8 }}>
        {props.isError ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {getErrorMessage(props.error)}
          </Alert>
        ) : null}
        {props.children}
      </Container>
    </div>
  );
}
