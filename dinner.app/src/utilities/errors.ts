import type { PostgrestError } from "@supabase/supabase-js";
import type { AppError, ValidationResult } from "./_types";

export function isAppError(error: any): error is AppError {
	return (
		error &&
		(error instanceof ValidationError || error instanceof DataError || error instanceof Error)
	);
}

export class ValidationError extends Error {
	readonly errors: string[];

	constructor(validation: ValidationResult) {
		super(validation.message);

		this.errors = validation.errors;
	}
}

export class DataError extends Error {
	readonly error: PostgrestError;

	constructor(error: PostgrestError) {
		super("An error occurred.");
		this.error = error;
	}
}
