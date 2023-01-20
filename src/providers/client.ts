import { createClient, PostgrestResponse } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSingleRow<T>(response: PostgrestResponse<T>): T {
  const { data, error } = response;
  if (error == null && data.length === 1) {
    return data[0];
  } else if (error == null && data.length > 1) {
    throw new Error("Query returned more than one result.");
  } else if (error == null && data.length === 0) {
    throw new Error("Record not found.");
  } else {
    throw new Error(error?.message ?? "An unexpected error occurred.");
  }
}

export function ensureSuccess<T>(response: PostgrestResponse<T>): T[] {
  const { data, error } = response;
  if (error == null) {
    return data;
  } else {
    throw new Error(error?.message ?? "An unexpected error occurred.");
  }
}

export function ensureEmptySuccess(response: PostgrestResponse<undefined>): boolean {
  const { error } = response;
  if (error == null) {
    return true;
  } else {
    throw new Error(error.message);
  }
}
