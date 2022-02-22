import { command } from "$utilities/operations";
import type { CommandStore } from "$utilities/_types";
import { client, getUser } from "./_index";
import type { Plan, PlanEdit } from "./_types";

const _plans_table = "plans";
const _plans_meals_table = "plans_meals";
const _plans_groceries_table = "plans_groceries";

const _plan_select = `
    id,
    user_id,
    updated_on,
    notes
`;

export async function upsertPlan(store: CommandStore, id: string, plan: PlanEdit) {
	return await command(store, async () => {
		// TODO - validate

		// get user
		const user = getUser();

		const response = await client.from<Plan>(_plans_table).upsert({
			id,
			user_id: user.id,
			...plan,
		});

		return id;
	});
}
