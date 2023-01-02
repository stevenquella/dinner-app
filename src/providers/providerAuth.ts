import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atom } from "jotai";
import { supabase } from "./client";

const authQueryKeys = {
  session: "session",
};

export const sessionAtom = atom<Session | null>(null);
export const useridAtom = atom((get) => get(sessionAtom)?.user.id ?? "");

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

export const useSignInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signIn(data.email, data.password),
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

export const useSignUpMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signUp(data.email, data.password),
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

export const useSignOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

async function getSession(): Promise<Session | null> {
  const latestSession = await supabase.auth.getSession();
  return latestSession.data.session;
}

async function signIn(email: string, password: string): Promise<boolean> {
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

async function signUp(email: string, password: string): Promise<boolean> {
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

async function signOut(): Promise<boolean> {
  const response = await supabase.auth.signOut();

  if (response.error != null) {
    throw new Error(response.error.message);
  } else {
    return true;
  }
}
