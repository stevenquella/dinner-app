import { command, DataError, query, single } from "$utilities/_index";
import type { CommandStore, QueryStore } from "$utilities/_types";
import { _grocery_validator, _id_validator, _meal_validator, _tag_validator } from "./validators";
import { client, getUser } from "./_index";
import type { Grocery, GroceryEdit, Meal, MealEdit, Tag, TagEdit } from "./_types";

const _meals_table = "meals";
const _meals_groceries_table = "meals_groceries";
const _meals_tags_table = "meals_tags";

const _meal_select = `
	id,
	user_id,
	updated_on,
	name,
	notes,
	tags:meals_tags (
		name,
		meal_id,
		user_id,
		updated_on
	),
	groceries:meals_groceries (
		category,
		name,
		meal_id,
		user_id,
		updated_on
	)
`;

export async function retrieveMeals(store: QueryStore<Meal[]>) {
	await query(store, async () => {
		const response = await client.from<Meal>(_meals_table).select(_meal_select).throwOnError();

		return response.data;
	});
}

export async function retrieveMeal(store: QueryStore<Meal>, id: string) {
	await query(store, async () => {
		const response = await client
			.from<Meal>(_meals_table)
			.select(_meal_select)
			.eq("id", id)
			.throwOnError();

		return single(response);
	});
}

export async function upsertMeal(
	store: CommandStore,
	id: string,
	meal: MealEdit,
	tags: TagEdit[],
	groceries: GroceryEdit[]
) {
	return command(store, async () => {
		// validate
		_id_validator.ensureValid({ id });
		_meal_validator.ensureValid(meal);
		_tag_validator.ensureValidCollection(tags || []);
		_grocery_validator.ensureValidCollection(groceries || []);

		// user
		const user = getUser();

		// update meal
		const updatedMeal = await client
			.from<Meal>(_meals_table)
			.upsert({
				user_id: user.id,
				id,
				...meal,
			})
			.eq("id", id);

		if (updatedMeal.error) {
			throw new DataError(updatedMeal.error);
		}

		// update tags
		const deletedTags = await client.from<Tag>(_meals_tags_table).delete().eq("meal_id", id);

		const updatedTags = await client.from<Tag>(_meals_tags_table).upsert(
			tags.map((i) => ({
				user_id: user.id,
				meal_id: id,
				...i,
			}))
		);

		if (deletedTags.error || updatedTags.error) {
			throw new DataError(deletedTags.error || updatedTags.error);
		}

		// update groceries
		const deletedGroceries = await client
			.from<Grocery>(_meals_groceries_table)
			.delete()
			.eq("meal_id", id);

		const updatedGroceries = await client.from<Grocery>(_meals_groceries_table).upsert(
			groceries.map((g) => ({
				user_id: user.id,
				meal_id: id,
				...g,
			}))
		);

		if (deletedGroceries.error || updatedGroceries.error) {
			throw new DataError(deletedGroceries.error || updatedGroceries.error);
		}

		return id;
	});
}

export async function deleteMeal(store: CommandStore, id: string) {
	return command(store, async () => {
		// validate
		_id_validator.ensureValid({ id });

		const deletedGroceries = await client
			.from<Grocery>(_meals_groceries_table)
			.delete()
			.eq("meal_id", id);
		if (deletedGroceries.error) {
			throw new DataError(deletedGroceries.error);
		}

		const deletedTags = await client.from<Tag>(_meals_tags_table).delete().eq("meal_id", id);
		if (deletedTags.error) {
			throw new DataError(deletedTags.error);
		}

		const deletedMeal = await client.from<Meal>(_meals_table).delete().eq("id", id);
		if (deletedMeal.error) {
			throw new DataError(deletedMeal.error);
		}
	});
}
