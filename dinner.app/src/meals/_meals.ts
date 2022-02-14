import type {
	CommandResult,
	CommandStore,
	QueryStore,
} from "../lib/operations";
import { queryCollection, queryItem, commandItem } from "../lib/operations";
import { client, getUser } from "../lib/client";
import { v4 as uuidv4 } from "uuid";

const _tags_table = "tags";
const _meal_table = "meals";
const _meal_select = `
	id,
	user_id,
	updated_on,
	name,
	notes,
	tags (
		name,
		meal_id,
		user_id,
		updated_on
	)
`;

export type Tag = {
	name: string;
	meal_id: string;
	user_id: string;
	updated_on: Date;
};

export type TagEdit = Pick<Tag, "name">;

export type Meal = {
	id: string;
	user_id: string;
	updated_on: Date;
	name: string;
	notes: string;
	tags: Tag[];
};

export type MealEdit = {
	meal: Pick<Meal, "id" | "name" | "notes">;
	tags: TagEdit[];
};

export type MealCreate = {
	meal: Pick<Meal, "name" | "notes">;
	tags: TagEdit[];
};

export function retrieveMeals(): QueryStore<any, Meal[]> {
	return queryCollection(
		async (_) => await client.from<Meal>(_meal_table).select(_meal_select)
	);
}

export function retrieveMeal(): QueryStore<string, Meal> {
	return queryItem(
		async (input) =>
			await client
				.from<Meal>(_meal_table)
				.select(_meal_select)
				.eq("id", input)
	);
}

export function updateMeal(): CommandStore<MealEdit, CommandResult<Meal>> {
	return commandItem(async (input: MealEdit) => {
		const user = getUser();

		// upsert tags
		await client.from<Tag>(_tags_table).upsert(
			input.tags.map((i) => ({
				user_id: user.id,
				meal_id: input.meal.id,
				...i,
			}))
		);

		// update meal
		return await client
			.from<Meal>(_meal_table)
			.update({
				user_id: user.id,
				...input.meal,
			})
			.eq("id", input.meal.id);
	});
}

export function createMeal(): CommandStore<MealCreate, CommandResult<Meal>> {
	return commandItem(
		async (input: MealCreate) => {
			const id: string = uuidv4();
			const user = getUser();

			// upsert tags

			const meal = await client.from<Meal>(_meal_table).insert({
				id: id,
				user_id: user.id,
				...input.meal,
			});

			await client.from<Tag>(_tags_table).insert(
				input.tags.map((i) => ({
					user_id: user.id,
					meal_id: id,
					...i,
				}))
			);

			return meal;
		}

		// TODO, upsert tags
	);
}

export function deleteMeal(): CommandStore<string, CommandResult<Meal>> {
	return commandItem(
		async (id: string) =>
			// TODO, delete tags
			await client.from<Meal>(_meal_table).delete().eq("id", id)
	);
}
