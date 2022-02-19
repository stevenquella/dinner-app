import { _signin_validator } from "$providers/users";
import { describe, expect, test } from "vitest";

describe("User validation tests.", () => {
	test("Email is required.", () => {
		const validation = _signin_validator.validate({ email: null, password: "asdofmasoiemf" });

		expect(validation.errors).to.include("Email is required.");
	});
});
