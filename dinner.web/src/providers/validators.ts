import { RuleFor, Validator } from "$utilities/validations";
import type {
	GroceryEdit,
	MealEdit,
	PlanEdit,
	PlanMealEdit,
	SignInInput,
	SignUpInput,
	TagEdit,
} from "./_types";
import { GroceryCategory } from "./_types";

export const _id_validator = new Validator<{ id: string }>(
	new RuleFor("id").uuid("Id must be a unique identifier.")
);

export const _signin_validator = new Validator<SignInInput>(
	new RuleFor<SignInInput>("email")
		.required("Email is required.")
		.email("Email expects a valid email address."),
	new RuleFor<SignInInput>("password").required("Password is required.")
);

export const _signup_validator = new Validator<SignUpInput>(
	new RuleFor<SignUpInput>("email")
		.required("Email is required.")
		.email("Email expects a valid email address."),
	new RuleFor<SignUpInput>("password")
		.required("Password is required.")
		.minLength(8, "Password must be at least 8 characters."),
	new RuleFor<SignUpInput>("confirm_password")
		.required("Password confirmation is required.")
		.must((i) => i.password === i.confirm_password, "Passwords must match.")
);

export const _plan_validator = new Validator<PlanEdit>(
	new RuleFor<PlanEdit>("date").required("Date is required.")
);

export const _plan_meal_validator = new Validator<PlanMealEdit>(
	new RuleFor<PlanMealEdit>("meal_id").required("Meal id is required.")
);

export const _meal_validator = new Validator<MealEdit>(
	new RuleFor<MealEdit>("name")
		.notEmpty("Name is required.")
		.minLength(3, "Name must be at least 3 characters.")
		.maxLength(500, "Name must be no greater than 500 characters.")
);

export const _tag_validator = new Validator<TagEdit>(
	new RuleFor<TagEdit>("name")
		.notEmpty("Tag name is required.")
		.maxLength(100, "Tag name must be not greater than 100 characters.")
);

export const _grocery_validator = new Validator<GroceryEdit>(
	new RuleFor<GroceryEdit>("category").must(
		(i) => Object.values(GroceryCategory).includes(i.category),
		"Grocery category must be an expected category value."
	),
	new RuleFor<GroceryEdit>("name")
		.notEmpty("Grocery name is required.")
		.maxLength(100, "Grocery name must not be greater than 100 characters.")
);
