import type {
	UserCredentials,
	ApiError,
	User,
	Session,
} from "@supabase/supabase-js";
import { client } from "../lib/client";
import { command } from "../lib/operations";

export interface ClientUserResponse {
	error: ApiError;
	user: User;
	session: Session;
}

export function signUp() {
	return command<UserCredentials, ClientUserResponse>((input) =>
		client.auth.signUp(input)
	);
}

export function signIn() {
	return command<UserCredentials, ClientUserResponse>((input) =>
		client.auth.signIn(input)
	);
}

export function signOut() {
	return command((_) => client.auth.signOut());
}
