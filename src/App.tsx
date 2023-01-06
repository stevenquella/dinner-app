import { LinearProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import LogIn from "./components/auth/LogIn";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { supabase } from "./providers/client";
import { sessionAtom, useSession } from "./providers/providerAuth";

export default function App() {
  const queryClient = useQueryClient();
  const [session, setSession] = useAtom(sessionAtom);
  const sessionQuery = useSession({
    onSuccess: (sesh) => setSession(sesh),
  });
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [session, setSession, queryClient]);

  let app = null;
  if (sessionQuery.isLoading) {
    app = <LinearProgress color="secondary" />;
  } else if (session != null) {
    app = <Outlet />;
  } else {
    app = <LogIn />;
  }

  return (
    <div>
      <Header />
      {app}
      {session != null ? <Footer /> : null}
    </div>
  );
}
