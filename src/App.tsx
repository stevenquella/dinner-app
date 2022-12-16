import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { supabase } from "./providers/client";

export default function App() {
  const [session, setSession] = useState<Session | null>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const refreshSession = async () => {
    const latestSession = await supabase.auth.getSession();
    setSession(latestSession.data.session);
  };

  const onLogin: React.FormEventHandler = async (e) => {
    e.preventDefault();

    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    console.debug(response);
    setSession(response.data.session);
  };

  const onLogout: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    setSession(null);
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
        <div>
          <div>You are logged in.</div>
          <div>{session.user.id}</div>
          <button type="button" onClick={onLogout}>
            LOG OUT
          </button>
        </div>
      ) : (
        <div>
          <div>You are NOT logged in.</div>
          <form onSubmit={onLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit">LOG IN</button>
          </form>
        </div>
      )}
    </div>
  );
}
