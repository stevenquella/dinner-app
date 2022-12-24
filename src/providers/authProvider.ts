import { supabase } from "./client";

export default async function signIn(
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

export async function signOut(): Promise<boolean> {
  const response = await supabase.auth.signOut();

  if (response.error != null) {
    throw new Error(response.error.message);
  } else {
    return true;
  }
}
