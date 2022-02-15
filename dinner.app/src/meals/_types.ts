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
