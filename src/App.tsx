import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./providers/client";

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
      {session != null ? (
        <div>You are logged in.</div>
      ) : (
        <div>You are NOT logged in.</div>
      )}
    </div>
  );
}
