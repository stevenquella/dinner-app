import { describe, expect, test } from "vitest";
import { _signin_validator } from "../src/providers/users";

describe("User validation tests.", () => {
	test("Email is required.", () => {
		const validation = _signin_validator.validate({ email: null, password: "asdofmasoiemf" });

		expect(validation.errors).to.include("Email is required.");
	});
});
