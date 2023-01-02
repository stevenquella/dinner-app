import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "./client";

const authQueryKeys = {
  session: "session",
};

export const useSession = (options: {
  onSuccess: (val: Session | null) => void;
}) => {
  return useQuery({
    queryKey: [authQueryKeys.session],
    queryFn: () => getSession(),
    onSuccess: options.onSuccess,
    cacheTime: 0,
  });
};

async function getSession(): Promise<Session | null> {
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
