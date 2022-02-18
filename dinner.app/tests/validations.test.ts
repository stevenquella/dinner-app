import { RuleFor, Validator } from "$utilities/validations";
import { describe, expect, it, test } from "vitest";

describe("Shared validation tests.", () => {
	type A = { value: any };
	const message_required = "Value is required.";
	const validator_required = new Validator<A>(new RuleFor<A>("value").required(message_required));

	it.each([null, undefined, ""])("Required check without value.", (x) => {
		const validation = validator_required.validate({ value: x });

		expect(validation.errors).to.include(message_required);
	});

	test("Required check with value.", () => {
		const validation = validator_required.validate({ value: {} });

		expect(validation.errors).to.not.include(message_required);
	});

	test("Must check for false result.", () => {
		const message = "Value is bad.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => false, message));
		const validation = validator.validate({ value: {} });

		expect(validation.errors).to.include(message);
	});

	test("Must check for true result.", () => {
		const message = "Value is good.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => true, message));
		const validation = validator.validate({ value: {} });

		expect(validation.errors).to.not.include(message);
	});
});

describe("String validation tests.", () => {
	// TODO not empty
	// TODO min length
	// TODO max length
	// TODO email
});
