import type { QueryStore } from "../lib/operations";
import { queryItem } from "../lib/operations";
import { queryCollection, buildColumns } from "../lib/operations";
import { client } from "../lib/client";

const table = "meals";

export type Meal = {
	id: string;
	updated_on: Date;
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
