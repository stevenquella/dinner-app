import { Container } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import LogIn from "./components/auth/LogIn";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { supabase } from "./providers/client";

export type AppContext = {
  session: Session;
};

export function useAppContext() {
  return useOutletContext<AppContext>();
}

export default function App() {
  const [session, setSession] = useState<Session | null>();

  const refreshSession = async () => {
    const latestSession = await supabase.auth.getSession();
    setSession(latestSession.data.session);
  };

  useEffect(() => {
    refreshSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      <Header />
      <Container fixed sx={{ py: 2 }}>
        {session != null ? <Outlet context={{ session }} /> : <LogIn />}
      </Container>
      <Footer />
    </div>
  );
}
