import * as _index from "$providers/_index";
import { deletePlan, upsertPlan } from "$providers/_index";
import type { GroceryEdit, PlanEdit, PlanMealEdit } from "$providers/_types";
import { GroceryCategory } from "$providers/_types";
import { getCommandStore, ValidationError } from "$utilities/_index";
import { v4 as uuidv4 } from "uuid";
import { describe, expect, it, spyOn } from "vitest";

describe("plans - upsert plan", () => {
	const invalid_inputs: {
		message: string;
		id: string;
		plan: PlanEdit;
		meals: PlanMealEdit[];
		groceries: GroceryEdit[];
	}[] = [
		// ID
		{
			message: "Id must be a unique identifier.",
			id: "1234",
			plan: {
				date: new Date(),
				notes: "",
			},
			meals: [],
			groceries: [],
		},
		// PLAN
		{
			message: "Date is required.",
			id: uuidv4(),
			plan: {
				date: null,
				notes: "",
			},
			meals: [],
			groceries: [],
		},
		// MEALS
		{
			message: "Meal id is required.",
			id: uuidv4(),
			plan: {
				date: new Date(),
				notes: "",
			},
			meals: [
				{
					meal_id: null,
				},
			],
			groceries: [],
		},
		// GROCERIES
		{
			message: "Grocery category must be an expected category value.",
			id: uuidv4(),
			plan: {
				date: new Date(),
				notes: "",
			},
			meals: [],
			groceries: [
				{
					category: "test" as GroceryCategory,
					name: "test",
				},
			],
		},
		{
			message: "Grocery name is required.",
			id: uuidv4(),
			plan: {
				date: new Date(),
				notes: "",
			},
			meals: [],
			groceries: [
				{
					category: GroceryCategory.Protein,
					name: " ",
				},
			],
		},
		{
			message: "Grocery name must not be greater than 100 characters.",
			id: uuidv4(),
			plan: {
				date: new Date(),
				notes: "",
			},
			meals: [],
			groceries: [
				{
					category: GroceryCategory.Produce,
					name: "wuaiwAxuA8KCMLcPQZM1RY2Up6bXkgHoexQsAGY90Vr9msAeB3YqEA96sfvP7nTOoRdolZaQvD5HsvZ7ydIyhcCDjjacEeaKGGpkZ",
				},
			],
		},
	];

	it.each(invalid_inputs)("should throw validation error for invalid input", async (inputs) => {
		const spy = spyOn(_index, "client", "get");

		const commandStore = getCommandStore();
		const response = await upsertPlan(
			commandStore,
			inputs.id,
			inputs.plan,
			inputs.meals,
			inputs.groceries
		);

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
		if (response instanceof ValidationError) {
			expect(response.message).to.contain(inputs.message);
			expect(response.errors).to.include(inputs.message);
		}
	});
});

describe("plans - delete plan", () => {
	it("should throw validation error for invalid input", async () => {
		const spy = spyOn(_index, "client", "get");

		const commandStore = getCommandStore();
		const response = await deletePlan(commandStore, "1234");

		expect(spy).toBeCalledTimes(0);
		expect(response).toBeInstanceOf(ValidationError);
	});
});
