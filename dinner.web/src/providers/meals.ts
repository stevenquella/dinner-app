import { command, DataError, query, RuleFor, single, Validator } from "$utilities/_index";
import type { CommandStore, QueryStore } from "$utilities/_types";
import { client, getUser } from "./_index";
import type { Grocery, GroceryEdit, Meal, MealEdit, Tag, TagEdit } from "./_types";
import { GroceryCategory } from "./_types";

const _groceries_table = "groceries";
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
	),
	groceries (
		category,
		name,
		meal_id,
		user_id,
		updated_on
	)
`;

const _id_validator = new Validator<{ id: string }>(
	new RuleFor("id").uuid("Id must be a unique identifier.")
);

const _meal_validator = new Validator<MealEdit>(
	new RuleFor<MealEdit>("name")
		.required("Name is required.")
		.notEmpty("Name must not be empty.")
		.minLength(3, "Name must be at least 3 characters.")
		.maxLength(500, "Name must be no greater than 500 characters.")
);

const _tag_validator = new Validator<TagEdit>(
	new RuleFor<TagEdit>("name")
		.required("Tag name is required.")
		.notEmpty("Tag name must not be empty.")
		.maxLength(100, "Tag name must be not greater than 100 characters.")
);

const _grocery_validator = new Validator<GroceryEdit>(
	new RuleFor<GroceryEdit>("category")
		.required("Grocery category is required.")
		.notEmpty("Grocery category must not be empty.")
		.must(
			(i) => Object.values(GroceryCategory).includes(i.category),
			"Grocery category must be an expected category value."
		),
	new RuleFor<GroceryEdit>("name")
		.required("Grocery name is required.")
		.notEmpty("Grocery name must not be empty.")
		.maxLength(100, "Grocery name must not be greater than 100 characters.")
);

export async function retrieveMeals(store: QueryStore<Meal[]>) {
	await query(store, async () => {
		const response = await client.from<Meal>(_meal_table).select(_meal_select).throwOnError();

		return response.data;
	});
}

export async function retrieveMeal(store: QueryStore<Meal>, id: string) {
	await query(store, async () => {
		const response = await client
			.from<Meal>(_meal_table)
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
			.from<Meal>(_meal_table)
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
		const updatedTags = await client.from<Tag>(_tags_table).upsert(
			tags.map((i) => ({
				user_id: user.id,
				meal_id: id,
				...i,
			}))
		);

		if (updatedTags.error) {
			throw new DataError(updatedTags.error);
		}

		// update groceries
		const updatedGroceries = await client.from<Grocery>(_groceries_table).upsert(
			groceries.map((g) => ({
				user_id: user.id,
				meal_id: id,
				...g,
			}))
		);

		if (updatedGroceries.error) {
			throw new DataError(updatedGroceries.error);
		}

		return id;
	});
}

export async function deleteMeal(store: CommandStore, id: string) {
	return command(store, async () => {
		// validate
		_id_validator.ensureValid({ id });

		const deletedGroceries = await client
			.from<Grocery>(_groceries_table)
			.delete()
			.eq("meal_id", id);
		if (deletedGroceries.error) {
			throw new DataError(deletedGroceries.error);
		}

		const deletedTags = await client.from<Tag>(_tags_table).delete().eq("meal_id", id);
		if (deletedTags.error) {
			throw new DataError(deletedTags.error);
		}

		const deletedMeal = await client.from<Meal>(_meal_table).delete().eq("id", id);
		if (deletedMeal.error) {
			throw new DataError(deletedMeal.error);
		}
	});
}
