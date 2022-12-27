import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routes";
import { themeOptions } from "./theme";

const theme = createTheme(themeOptions);

const router = createBrowserRouter(routes);

const query = new QueryClient();

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={query}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
