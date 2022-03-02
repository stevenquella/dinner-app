// PLANS

export type Plan = {
	id: string;
	user_id: string;
	updated_on: Date;
	date: Date;
	notes: string;
	meals: Meal[];
	groceries: Grocery[];
};

export type PlanMeal = {
	plan_id: string;
	meal_id: string;
	user_id: string;
	updated_on: Date;
};

export type PlanEdit = Pick<Plan, "date" | "notes">;

export type PlanMealEdit = Pick<Grocery, "meal_id">;

// GROCERIES
export enum GroceryCategory {
	Produce = "Produce",
	Protein = "Protein",
	Dairy = "Dairy",
	Pantry = "Pantry",
	Frozen = "Frozen",
	Other = "Other",
}

export type Grocery = {
	category: GroceryCategory;
	name: string;
	meal_id?: string;
	plan_id?: string;
	user_id: string;
	updated_on: Date;
};

export type GroceryEdit = Pick<Grocery, "category" | "name">;

// TAGS

export type Tag = {
	name: string;
	meal_id: string;
	user_id: string;
	updated_on: Date;
};

export type TagEdit = Pick<Tag, "name">;

// MEALS

export type Meal = {
	id: string;
	user_id: string;
	updated_on: Date;
	name: string;
	notes: string;
	tags: Tag[];
	groceries: Grocery[];
};

export type MealEdit = Pick<Meal, "name" | "notes">;

// USERS

export type SignUpInput = {
	email: string;
	password: string;
	confirm_password: string;
};

export type SignInInput = {
	email: string;
	password: string;
};
