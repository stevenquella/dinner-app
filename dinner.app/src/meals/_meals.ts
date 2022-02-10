import type { CommandStore, QueryStore } from "../lib/operations";
import { queryItem } from "../lib/operations";
import { queryCollection, buildColumns, command } from "../lib/operations";
import { client } from "../lib/client";

const table = "meals";

export type Meal = {
	id: string;
	user_id: string;
	updated_on: Date;
	name: string;
	notes: string;
};

export type MealEdit = {
	id: string;
	user_id: string;
	name: string;
	notes: string;
};

export type MealCreate = {
	user_id: string;
	name: string;
	notes: string;
};

export function retrieveMeals(): QueryStore<any, Meal[]> {
	return queryCollection(
		async (_) =>
			await client
				.from<Meal>(table)
				.select(buildColumns<Meal>("id", "name"))
	);
}

export function retrieveMeal(): QueryStore<string, Meal> {
	return queryItem(
		async (input) =>
			await client
				.from<Meal>(table)
				.select(buildColumns<Meal>("id", "name", "notes", "updated_on"))
				.eq("id", input)
	);
}

export function updateMeal(): CommandStore<MealEdit, any> {
	return command<MealEdit, any>(
		async (input) =>
			await client.from<Meal>(table).update(input).eq("id", input.id)
	);
}

export function createMeal(): CommandStore<MealCreate, any> {
	return command<MealCreate, any>(
		async (input) => await client.from<Meal>(table).insert(input)
	);
}
