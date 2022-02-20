import { client, signIn, signUp } from "$providers/_index";
import type { SignInInput, SignUpInput } from "$providers/_types";
import { getCommandStore, ValidationError } from "$utilities/_index";
import { describe, expect, it, spyOn } from "vitest";

describe("users - sign up", () => {
	const invalid_inputs: SignUpInput[] = [
		{
			// email required
			email: "",
			password: "123456789",
			confirm_password: "123456789",
		},
		{
			// email must be an email
			email: "stevenquella",
			password: "123456789",
			confirm_password: "123456789",
		},
		{
			// password required
			email: "sq@gmail.com",
			password: "",
			confirm_password: "",
		},
		{
			// password minimum length
			email: "sq@gmail.com",
			password: "1234567",
			confirm_password: "1234567",
		},
		{
			// confirm password match
			email: "sq@gmail.com",
			password: "123456789",
			confirm_password: "12345678",
		},
	];

	it.each(invalid_inputs)("should throw validation error for invalid input", async (input) => {
		const spy = spyOn(client.auth, "signUp");

		const commandStore = getCommandStore();
		const response = await signUp(commandStore, input);

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});
});

describe("users - sign in", () => {
	const invalid_inputs: SignInInput[] = [
		{
			// email is required
			email: "  ",
			password: "password",
		},
		{
			// email must be an email
			email: "stevenquella",
			password: "password",
		},
		{
			// password is required
			email: "sq@gmail.com",
			password: "",
		},
	];

	it.each(invalid_inputs)("should throw validation error for invalid input", async (input) => {
		const spy = spyOn(client.auth, "signIn");

		const commandStore = getCommandStore();
		const response = await signIn(commandStore, input);

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});
});
