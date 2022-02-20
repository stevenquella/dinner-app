import { client, signIn, signOut, signUp } from "$providers/_index";
import type { SignInInput, SignUpInput } from "$providers/_types";
import { DataError, ValidationError } from "$utilities/errors";
import { getCommandStore } from "$utilities/operations";
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

	it("should throw data error on client error", async () => {
		const spy = spyOn(client.auth, "signUp").mockImplementation(() => {
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
		const response = await signUp(commandStore, {
			email: "sq@gmail.com",
			password: "asdofiamsdiofm",
			confirm_password: "asdofiamsdiofm",
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
		const spy = spyOn(client.auth, "signUp").mockImplementation(() => {
			return Promise.resolve({
				user: result,
				session: null,
				error: null,
			});
		});

		const commandStore = getCommandStore();
		const response = await signUp(commandStore, {
			email: "sq@gmail.com",
			password: "asdofiamsdiofm",
			confirm_password: "asdofiamsdiofm",
		});

		expect(spy).toBeCalledTimes(1);
		expect(response).toBe(result);
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

	it("should throw data error on client error", async () => {
		const spy = spyOn(client.auth, "signIn").mockImplementation(() => {
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
		const spy = spyOn(client.auth, "signIn").mockImplementation(() => {
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

describe("users - sign out", () => {
	it("should throw data error on client error", async () => {
		const spy = spyOn(client.auth, "signOut").mockImplementation(() => {
			return Promise.resolve({
				error: {
					message: "error",
					status: 500,
				},
			});
		});

		const commandStore = getCommandStore();
		const response = await signOut(commandStore);

		expect(spy).toBeCalledTimes(1);
		expect(response).toBeInstanceOf(DataError);
	});

	it("should return undefined on success", async () => {
		const spy = spyOn(client.auth, "signOut").mockImplementation(() => {
			return Promise.resolve({
				error: undefined,
			});
		});

		const commandStore = getCommandStore();
		const response = await signOut(commandStore);

		expect(spy).toBeCalledTimes(1);
		expect(response).toBeUndefined();
	});
});
