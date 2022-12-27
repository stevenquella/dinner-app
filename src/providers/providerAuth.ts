import { Session } from "@supabase/supabase-js";
import { supabase } from "./client";

export const authQueryKeys = {
  session: "session",
};

export async function getSession(): Promise<Session | null> {
  const latestSession = await supabase.auth.getSession();
  return latestSession.data.session;
}

export async function signIn(
  email: string,
  password: string
): Promise<boolean> {
  const response = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (response.error != null) {
    throw new Error(response.error.message);
  } else {
    return true;
  }
}

export async function signUp(
  email: string,
  password: string
): Promise<boolean> {
  const response = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (response.error != null) {
    throw new Error(response.error.message);
  } else {
    return true;
  }
}

export async function signOut(): Promise<boolean> {
  const response = await supabase.auth.signOut();

  if (response.error != null) {
    throw new Error(response.error.message);
  } else {
    return true;
  }
}
