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

type DataErrorType = {
	message: string;
	details?: string;
	hint?: string;
	code?: string;
	status?: number;
};

export class DataError extends Error {
	readonly error: DataErrorType;

	constructor(error: DataErrorType) {
		super("An error occurred.");
		this.error = error;
	}
}
