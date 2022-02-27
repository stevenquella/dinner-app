import { command } from "$utilities/operations";
import { RuleFor, Validator } from "$utilities/validations";
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

const _id_validator = new Validator<{ id: string }>(
	new RuleFor("id").uuid("Id must be a unique identifier.")
);
const _plan_validator = new Validator<PlanEdit>(
	new RuleFor<PlanEdit>("date").required("Date is required.")
);

export async function upsertPlan(store: CommandStore, id: string, plan: PlanEdit) {
	return await command(store, async () => {
		_id_validator.ensureValid({ id });
		_plan_validator.ensureValid(plan);

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
