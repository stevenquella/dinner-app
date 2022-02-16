import type { CommandStore } from "../lib/types";
import { client } from "../lib/client";
import { command } from "../lib/operations";
import type { SignUpInput, SignInInput } from "./_types";

// TODO add validators for sign up and sign in

export async function signUp(store: CommandStore, input: SignUpInput) {
	return command(store, async () => {
		const response = await client.auth.signUp(input);

		if (response.error) {
			throw new Error(response.error.message);
		}

		if (!response.user) {
			throw new Error("Failed to complete sign up.");
		}

		// will return the user, but does not change the auth state, requires email confirmation
		return response.user;
	});
}

export async function signIn(store: CommandStore, input: SignInInput) {
	return command(store, async () => {
		const response = await client.auth.signIn(input);

		if (response.error) {
			throw new Error(response.error.message);
		}
	});
}

export async function signOut(store: CommandStore) {
	return command(store, async () => await client.auth.signOut());
}
