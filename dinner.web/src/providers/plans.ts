import { command, DataError } from "$utilities/_index";
import type { CommandStore } from "$utilities/_types";
import {
	_grocery_validator,
	_id_validator,
	_plan_meal_validator,
	_plan_validator,
} from "./validators";
import { client, getUser } from "./_index";
import type { Grocery, GroceryEdit, Plan, PlanEdit, PlanMeal, PlanMealEdit } from "./_types";

const _plans_table = "plans";
const _plans_meals_table = "plans_meals";
const _plans_groceries_table = "plans_groceries";

const _plan_select = `
    id,
    user_id,
    updated_on,
    notes
`;

export async function upsertPlan(
	store: CommandStore,
	id: string,
	plan: PlanEdit,
	meals: PlanMealEdit[],
	groceries: GroceryEdit[]
) {
	return await command(store, async () => {
		_id_validator.ensureValid({ id });
		_plan_validator.ensureValid(plan);
		_plan_meal_validator.ensureValidCollection(meals);
		_grocery_validator.ensureValidCollection(groceries);

		// get user
		const user = getUser();

		// update plan
		const updatedPlan = await client.from<Plan>(_plans_table).upsert({
			id,
			user_id: user.id,
			...plan,
		});

		if (updatedPlan.error) {
			throw new DataError(updatedPlan.error);
		}

		// update meal references
		const deletedMeals = await client
			.from<PlanMeal>(_plans_meals_table)
			.delete()
			.eq("plan_id", id);

		const updatedMeals = await client.from<PlanMeal>(_plans_meals_table).upsert(
			meals.map((meal) => ({
				plan_id: id,
				user_id: user.id,
				...meal,
			}))
		);

		if (deletedMeals.error || updatedMeals.error) {
			throw new DataError(deletedMeals.error || updatedMeals.error);
		}

		// update groceries
		const deletedGroceries = await client
			.from<Grocery>(_plans_groceries_table)
			.delete()
			.eq("plan_id", id);

		const updatedGroceries = await client.from<Grocery>(_plans_groceries_table).upsert(
			groceries.map((g) => ({
				user_id: user.id,
				plan_id: id,
				...g,
			}))
		);

		if (deletedGroceries.error || updatedGroceries.error) {
			throw new DataError(deletedGroceries.error || updatedGroceries.error);
		}

		return id;
	});
}

export async function deletePlan(store: CommandStore, id: string) {
	return command(store, async () => {
		// validate
		_id_validator.ensureValid({ id });

		const deletedGroceries = await client
			.from<Grocery>(_plans_groceries_table)
			.delete()
			.eq("plan_id", id);
		if (deletedGroceries.error) {
			throw new DataError(deletedGroceries.error);
		}

		const deletedMeals = await client
			.from<PlanMeal>(_plans_meals_table)
			.delete()
			.eq("plan_id", id);
		if (deletedMeals.error) {
			throw new DataError(deletedMeals.error);
		}

		const deletedPlan = await client.from<Plan>(_plans_table).delete().eq("id", id);
		if (deletedPlan.error) {
			throw new DataError(deletedPlan.error);
		}
	});
}
