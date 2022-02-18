// MEALS

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
