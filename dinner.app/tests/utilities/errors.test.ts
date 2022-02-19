import { DataError, isAppError, ValidationError } from "$utilities/errors";
import { describe, expect, it } from "vitest";

describe("errors - is app error", () => {
	it("should match a validation error", () => {
		const validation = new ValidationError({
			valid: false,
			message: "test",
			errors: ["test"],
		});

		const match = isAppError(validation);

		expect(match).toBe(true);
	});

	it("should match a data error", () => {
		const data = new DataError({
			message: "test",
			details: "test",
			hint: "no hint",
			code: "code",
		});

		const match = isAppError(data);

		expect(match).toBe(true);
	});

	it("should match an error", () => {
		const validation = new Error("test");

		const match = isAppError(validation);

		expect(match).toBe(true);
	});
});

describe("errors - validation error", () => {
	it("should use validation message as error message", () => {
		const validation = new ValidationError({
			valid: false,
			message: "test",
			errors: ["test"],
		});

		expect(validation.message).toBe("test");
	});
});

describe("errors - data error", () => {
	it("should use generic error as error message", () => {
		const data = new DataError({
			message: "test",
			details: "test",
			hint: "no hint",
			code: "code",
		});

		expect(data.message).toBe("An error occurred.");
	});
});
