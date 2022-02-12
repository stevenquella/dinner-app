import type { CommandStore, QueryStore } from "../lib/operations";
import { queryCollection, queryItem, commandItem } from "../lib/operations";
import { client } from "../lib/client";

const _table = "meals";
const _select = `
	id,
	user_id,
	updated_on,
	name,
	notes,
	tags (
		name
	)
`;

export type Tag = {
	name: string;
};

export type Meal = {
	id: string;
	user_id: string;
	updated_on: Date;
	name: string;
	notes: string;
	tags: Tag[];
};

export type MealEdit = Pick<Meal, "id" | "user_id" | "name" | "notes">;
export type MealCreate = Pick<Meal, "user_id" | "name" | "notes">;

export function retrieveMeals(): QueryStore<any, Meal[]> {
	return queryCollection(
		async (_) => await client.from<Meal>(_table).select(_select)
	);
}

export function retrieveMeal(): QueryStore<string, Meal> {
	return queryItem(
		async (input) =>
			await client.from<Meal>(_table).select(_select).eq("id", input)
	);
}

export function updateMeal(): CommandStore<MealEdit, Meal> {
	return commandItem(
		async (input: MealEdit) =>
			await client
				.from<Meal>(_table)
				.update(input, { returning: "minimal" })
				.eq("id", input.id)

		// TODO, upsert tags
	);
}

export function createMeal(): CommandStore<MealCreate, Meal> {
	return commandItem(
		async (input: MealCreate) =>
			await client
				.from<Meal>(_table)
				.insert(input, { returning: "minimal" })

		// TODO, upsert tags
	);
}

export function deleteMeal(): CommandStore<string, Meal> {
	return commandItem(
		async (id: string) =>
			// TODO, delete tags
			await client
				.from<Meal>(_table)
				.delete({ returning: "minimal" })
				.eq("id", id)
	);
}
