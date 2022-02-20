import { client, signIn } from "$providers/_index";
import type { SignInInput } from "$providers/_types";
import { DataError, ValidationError } from "$utilities/errors";
import { getCommandStore } from "$utilities/operations";
import { describe, expect, it, spyOn } from "vitest";

// TODO - sign up tests

describe("providers - user sign in", () => {
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
		const spy = spyOn(client.auth, "signIn").mockImplementation((i, o) => {
			return Promise.resolve({
				user: null,
				session: null,
				error: null,
			});
		});

		const commandStore = getCommandStore();
		const response = await signIn(commandStore, input);

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});

	it("should throw data error on client error", async () => {
		const spy = spyOn(client.auth, "signIn").mockImplementation((i, o) => {
			return Promise.resolve({
				user: null,
				session: null,
				error: {
					message: "mocked",
					status: 401,
				},
			});
		});

		const commandStore = getCommandStore();
		const response = await signIn(commandStore, {
			email: "sq@gmail.com",
			password: "asdofiamsdiofm",
		});

		expect(spy).toBeCalledTimes(1);
		expect(response).toBeInstanceOf(DataError);
	});

	it("should return user on success", async () => {
		const result = {
			id: "1234",
			app_metadata: null,
			user_metadata: null,
			aud: "this",
			created_at: "earlier",
		};
		const spy = spyOn(client.auth, "signIn").mockImplementation((i, o) => {
			return Promise.resolve({
				user: result,
				session: null,
				error: null,
			});
		});

		const commandStore = getCommandStore();
		const response = await signIn(commandStore, {
			email: "sq@gmail.com",
			password: "asdofiamsdiofm",
		});

		expect(spy).toBeCalledTimes(1);
		expect(response).toBe(result);
	});
});

// TODO - sign out test

export {};
