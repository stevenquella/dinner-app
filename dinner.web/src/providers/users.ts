import { client } from "$providers/_index";
import { DataError } from "$utilities/errors";
import { command } from "$utilities/_index";
import type { CommandStore } from "$utilities/_types";
import { _signin_validator, _signup_validator } from "./validators";
import type { SignInInput, SignUpInput } from "./_types";

export async function signUp(store: CommandStore, input: SignUpInput) {
	return command(store, async () => {
		_signup_validator.ensureValid(input);

		const response = await client.auth.signUp(input);

		if (response.error) {
			throw new DataError(response.error);
		}

		// will return the user, but does not change the auth state, requires email confirmation
		return response.user;
	});
}

export async function signIn(store: CommandStore, input: SignInInput) {
	return command(store, async () => {
		_signin_validator.ensureValid(input);

		const response = await client.auth.signIn(input);

		if (response.error) {
			throw new DataError(response.error);
		}

		return response.user;
	});
}

export async function signOut(store: CommandStore) {
	return command(store, async () => {
		const response = await client.auth.signOut();

		if (response.error) {
			throw new DataError(response.error);
		}
	});
}
