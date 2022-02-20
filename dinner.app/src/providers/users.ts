import { client } from "$providers/_index";
import { DataError } from "$utilities/errors";
import { command, RuleFor, Validator } from "$utilities/_index";
import type { CommandStore } from "$utilities/_types";
import type { SignInInput, SignUpInput } from "./_types";

const _signin_validator = new Validator<SignInInput>(
	new RuleFor<SignInInput>("email")
		.required("Email is required.")
		.email("Email expects a valid email address."),
	new RuleFor<SignInInput>("password").required("Password is required.")
);

const _signup_validator = new Validator<SignUpInput>(
	new RuleFor<SignUpInput>("email")
		.required("Email is required.")
		.email("Email expects a valid email address."),
	new RuleFor<SignUpInput>("password")
		.required("Password is required.")
		.minLength(8, "Password must be at least 8 characters."),
	new RuleFor<SignUpInput>("confirm_password")
		.required("Password confirmation is required.")
		.must((i) => i.password === i.confirm_password, "Passwords must match.")
);

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
