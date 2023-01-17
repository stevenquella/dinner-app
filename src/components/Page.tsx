import { Alert, Container, LinearProgress } from "@mui/material";
import { getErrorMessage } from "../providers/helpers";

export type PageProps = PageState & {
  children?: React.ReactElement | React.ReactElement[];
};

export type PageState = {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown | any;
};

export function combineStates(states: PageState[]): PageState {
  return {
    isLoading: states.some((x) => x.isLoading),
    isError: states.some((x) => x.isError),
    error: states
      .filter((x) => x.isError)
      .map((x) => getErrorMessage(x.error))
      .join(" "),
  };
}

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
