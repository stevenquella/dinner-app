import * as _index from "$providers/_index";
import { deleteMeal, upsertMeal } from "$providers/_index";
import type { MealEdit, TagEdit } from "$providers/_types";
import { getCommandStore, ValidationError } from "$utilities/_index";
import { v4 as uuidv4 } from "uuid";
import { describe, expect, it, spyOn } from "vitest";

describe("meals - upsert meal", () => {
	const invalid_inputs: { id: string; meal: MealEdit; tags: TagEdit[] }[] = [
		{
			// id must be a uuid
			id: "1234",
			meal: {
				name: "",
				notes: "",
			},
			tags: [],
		},
		{
			// meal name is required
			id: uuidv4(),
			meal: {
				name: "",
				notes: "",
			},
			tags: [],
		},
		{
			// meal name must not be empty
			id: uuidv4(),
			meal: {
				name: "\t\t",
				notes: "",
			},
			tags: [],
		},
		{
			// meal name must be at least 3 characters
			id: uuidv4(),
			meal: {
				name: "ab",
				notes: "",
			},
			tags: [],
		},
		{
			// http://www.unit-conversion.info/texttools/random-string-generator/
			// meal name must be no greater than 500 characters
			id: uuidv4(),
			meal: {
				name: "xE91BvG5yonJzJBxKPZ2X04WGABM70zT7JHXbx3l269eJWJwjeekI6rTdKf3DKo5mdHtvU5RCgS1SPWvnZ4ulM2EyCDr3dVMxh37lRG7uxVk6UllGJheJymlSxUedlU9uPhD8AD44y5mXeumn0uULb1msGHpmgFdn3VRKTlpynriLVFWP5dXP4DYmM19VRTm6WxxSTH7IX2e0SsP5wYvsHBZBwYud4iGddf5Yxk7u2sEzGt7nSW81SlUwT5nhmfZkBqHNctOhrisATrVY6xkggIubJOFzgAO30saNK7ITbILGvz183ENAHFMjubnjV8Ky6PbZd0XVHX4F8Ulhm0mGGHUQshp7g2iryZE5Pl4wgljUIyjbnzGJvVap5SgAQfXW2a2O2XhANpvyI3o54MILl1BEX7oWnaiYR5iG3E8ArnqTXc8yimX7gsi6p6bvB76zDrDW1EVbjjKX8TLZo8PbuFjuD604mKbVfPH7o7jA7P2bXuIt8GAx",
				notes: "",
			},
			tags: [],
		},
		{
			// tag name is requird
			id: uuidv4(),
			meal: {
				name: "abc",
				notes: "",
			},
			tags: [
				{
					name: "",
				},
			],
		},
		{
			// tag name must not be empty
			id: uuidv4(),
			meal: {
				name: "abc",
				notes: "",
			},
			tags: [
				{
					name: "\r\n",
				},
			],
		},
		{
			// tag name must be no greater than 100 characters
			id: uuidv4(),
			meal: {
				name: "ab",
				notes: "",
			},
			tags: [
				{
					name: "wuaiwAxuA8KCMLcPQZM1RY2Up6bXkgHoexQsAGY90Vr9msAeB3YqEA96sfvP7nTOoRdolZaQvD5HsvZ7ydIyhcCDjjacEeaKGGpkZ",
				},
			],
		},
	];

	it.each(invalid_inputs)("should throw validation error for invalid input", async (inputs) => {
		const spy = spyOn(_index, "client", "get");

		const commandStore = getCommandStore();
		const response = await upsertMeal(commandStore, null, inputs.meal, inputs.tags);

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});
});

describe("meals - delete meal", () => {
	it("should throw validation error for invalid input", async () => {
		const spy = spyOn(_index, "client", "get");

		const commandStore = getCommandStore();
		const response = await deleteMeal(commandStore, "1234");

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});
});
