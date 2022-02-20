import { command, getCommandStore, getQueryStore, query, single } from "$utilities/operations";
import { get } from "svelte/store";
import { describe, expect, it, spyOn } from "vitest";

describe("operations - get query store", () => {
	it("should default to loading true", () => {
		const store = getQueryStore();
		const state = get(store);

		expect(state.loading).toBe(true);
		expect(state.error).toBeFalsy();
		expect(state.result).toBeFalsy();
	});
});

describe("operations - query", () => {
	it("should set error on rejection", async () => {
		const message = "error message";
		const store = getQueryStore();
		const spy = spyOn(store, "set");

		await query(store, async () => {
			await Promise.resolve("huh?");
			throw new Error(message);
		});

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, { loading: true });

		const state = get(store);
		expect(state.loading).toBe(false);
		expect(state.error).toBeTruthy();
		expect(state.error.message).toBe(message);
		expect(state.result).toBeFalsy();
	});

	it("should set the result on completion", async () => {
		const result = { value: "1234" };
		const store = getQueryStore();
		const spy = spyOn(store, "set");

		await query(store, () => {
			return Promise.resolve(result);
		});

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, { loading: true });

		const state = get(store);
		expect(state.loading).toBe(false);
		expect(state.error).toBeFalsy();
		expect(state.result).toBe(result);
	});
});

describe("operations - get command store", () => {
	it("should default to loading false", () => {
		const store = getCommandStore();
		const state = get(store);

		expect(state.loading).toBe(false);
	});
});

describe("operations - command", () => {
	it("should return error on rejection", async () => {
		const message = "error message";
		const store = getCommandStore();
		const spy = spyOn(store, "set");

		const response = await command(store, async () => {
			await Promise.resolve("huh?");
			throw new Error(message);
		});

		expect(response).toBeTruthy();
		expect(response).toBeInstanceOf(Error);

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, { loading: true });

		const state = get(store);
		expect(state.loading).toBe(false);
	});

	it("should return result on completion", async () => {
		const result = { value: "1234" };
		const store = getCommandStore();
		const spy = spyOn(store, "set");

		const response = await command(store, () => {
			return Promise.resolve(result);
		});

		expect(response).toBeTruthy();
		expect(response).toBe(result);

		expect(spy).toBeCalledTimes(2);
		expect(spy).toHaveBeenNthCalledWith(1, { loading: true });

		const state = get(store);
		expect(state.loading).toBe(false);
	});
});

describe("operations - single", () => {
	it("should return null if data is null", () => {
		const item = single({
			body: null,
			count: 0,
			data: null,
			error: null,
			status: 200,
			statusText: "OK",
		});

		expect(item).toBeNull();
	});

	it("should return null if data is empty", () => {
		const item = single({
			body: null,
			count: 0,
			data: [],
			error: null,
			status: 200,
			statusText: "OK",
		});

		expect(item).toBeNull();
	});

	it("should return null if more than one item", () => {
		const item = single({
			body: null,
			count: 4,
			data: [{ value: "1" }, { value: "2" }],
			error: null,
			status: 200,
			statusText: "OK",
		});

		expect(item).toBeNull();
	});

	it("should return single item if single item", () => {
		const expected = { value: "1" };
		const item = single({
			body: null,
			count: 4,
			data: [expected],
			error: null,
			status: 200,
			statusText: "OK",
		});

		expect(item).toBe(expected);
	});
});
