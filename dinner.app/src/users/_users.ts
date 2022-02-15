import type { CommandStore } from "../lib/operations";
import { client } from "../lib/client";
import { command } from "../lib/operations";
import type { SignUpInput, SignInInput } from "./_types";

export async function signUp(store: CommandStore, input: SignUpInput) {
	return command(store, async () => await client.auth.signUp(input));
}

export async function signIn(store: CommandStore, input: SignInInput) {
	return command(store, async () => await client.auth.signIn(input));
}

export async function signOut(store: CommandStore) {
	return command(store, async () => await client.auth.signOut());
}
