import type { CommandStore, QueryStore } from "../lib/operations";
import { queryItem } from "../lib/operations";
import { queryCollection, buildColumns, commandItem } from "../lib/operations";
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

export function updateMeal(): CommandStore<MealEdit, Meal> {
	return commandItem(
		async (input: MealEdit) =>
			await client.from<Meal>(table).update(input).eq("id", input.id)
	);
}

export function createMeal(): CommandStore<MealCreate, Meal> {
	return commandItem(
		async (input: MealCreate) =>
			await client.from<Meal>(table).insert(input)
	);
}

export function deleteMeal(): CommandStore<string, Meal> {
	return commandItem(
		async (id: string) =>
			await client.from<Meal>(table).delete().eq("id", id)
	);
}
