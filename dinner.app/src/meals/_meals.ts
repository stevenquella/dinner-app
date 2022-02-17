import { v4 as uuidv4 } from "uuid";
import { client, getUser } from "../lib/client";
import { DataError } from "../lib/errors";
import { command, query, single } from "../lib/operations";
import type { CommandStore, QueryStore } from "../lib/types";
import { RuleFor, Validator } from "../lib/validations";
import type { Meal, MealEdit, Tag, TagEdit } from "./_types";

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

export async function retrieveMeals(store: QueryStore<Meal[]>) {
	await query(store, async () => {
		const response = await client
			.from<Meal>(_meal_table)
			.select(_meal_select)
			.throwOnError();

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

export async function updateMeal(
	store: CommandStore,
	id: string,
	meal: MealEdit,
	tags: TagEdit[]
) {
	return command(store, async () => await upsertMeal(id, meal, tags));
}

export async function createMeal(
	store: CommandStore,
	meal: MealEdit,
	tags: TagEdit[]
) {
	return command(store, async () => await upsertMeal(uuidv4(), meal, tags));
}

export async function deleteMeal(store: CommandStore, id: string) {
	return command(store, async () => {
		const deletedMeal = await client
			.from<Meal>(_meal_table)
			.delete()
			.eq("id", id);

		if (deletedMeal.error) {
			throw new DataError(deletedMeal.error);
		}
	});
}

async function upsertMeal(id: string, meal: MealEdit, tags: TagEdit[]) {
	const user = getUser();

	// validate
	_meal_validator.ensureValid(meal);
	_tag_validator.ensureValidCollection(tags || []);

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
}
