import { Alert, Container, LinearProgress } from "@mui/material";
import { createContext, useContext } from "react";

export type PageProps = PageContext & {
  children?: JSX.Element | JSX.Element[];
};

export type PageContext = {
  busy: boolean;
  error: string | null;
};

const pageContext = createContext<PageContext | null>(null);
export function usePageContext(): PageContext | null {
  return useContext<PageContext | null>(pageContext);
}

export default function Page(props: PageProps) {
  return (
    <pageContext.Provider value={{ busy: props.busy, error: props.error }}>
      {props.busy ? <LinearProgress color="secondary" /> : null}
      <Container fixed sx={{ py: 2, mb: 8 }}>
        {props.error != null ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {props.error}
          </Alert>
        ) : null}
        {props.children}
      </Container>
    </pageContext.Provider>
  );
}
