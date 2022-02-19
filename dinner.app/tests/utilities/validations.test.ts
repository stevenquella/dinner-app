import { RuleFor, Validator } from "$utilities/validations";
import { describe, expect, it } from "vitest";

describe("validations - required check", () => {
	type A = { value: any };
	const message_required = "Value is required.";
	const validator_required = new Validator<A>(new RuleFor<A>("value").required(message_required));

	it.each([null, undefined, ""])("should return invalid when no value", (x) => {
		const validation = validator_required.validate({ value: x });

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).to.include(message_required);
	});

	it("should return valid when has value", () => {
		const validation = validator_required.validate({ value: {} });

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - must check", () => {
	type A = { value: any };

	it("should return invalid when check returns false", () => {
		const message = "Value is bad.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => false, message));
		const validation = validator.validate({ value: {} });

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).to.include(message);
	});

	it("should return valid when check returns true", () => {
		const message = "Value is good.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => true, message));
		const validation = validator.validate({ value: {} });

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - not empty check", () => {
	type A = { value: string };

	// NOT EMPTY
	const message_notempty = "Value must not be empty.";
	const validator_notempty = new Validator<A>(new RuleFor<A>("value").notEmpty(message_notempty));

	it.each([null, undefined, "", " ", "\t"])(
		"should return invalid when value is empty or whitespace",
		(x) => {
			const validation = validator_notempty.validate({ value: x });

			expect(validation.valid).toBe(false);
			expect(validation.message).to.not.be.empty;
			expect(validation.errors).to.include(message_notempty);
		}
	);

	it("should return valid when value is not empty", () => {
		const validation = validator_notempty.validate({ value: "a" });

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - min length check", () => {
	type A = { value: string };

	// MIN LENGTH
	const message_minlength = "Value must be at least 4 characters.";
	const validator_minlength = new Validator<A>(
		new RuleFor<A>("value").minLength(4, message_minlength)
	);

	it.each(["", "a", "abc "])("should return invalid if less than min length", (x) => {
		const validation = validator_minlength.validate({ value: x });

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).to.include(message_minlength);
	});

	it.each(["asdf", "asdfasdf"])(
		"should return valid if greater than or equal to min length",
		(x) => {
			const validation = validator_minlength.validate({ value: x });

			expect(validation.valid).toBe(true);
			expect(validation.message).to.be.empty;
			expect(validation.errors).to.be.empty;
		}
	);
});

describe("validations - max length check", () => {
	type A = { value: string };

	// MAX LENGTH
	const message_maxlength = "Value must be no greater than 4 characters.";
	const validator_maxlength = new Validator<A>(
		new RuleFor<A>("value").maxLength(4, message_maxlength)
	);

	it.each(["asdfa", "asdfasdf"])("should return invalid if greater than max length", (x) => {
		const validation = validator_maxlength.validate({ value: x });

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).to.include(message_maxlength);
	});

	it.each(["", "a", "abcd"])("should return valid if less than or equal to max length", (x) => {
		const validation = validator_maxlength.validate({ value: x });

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - email check", () => {
	type A = { value: string };

	// EMAIL
	const message_email = "Value requires a valid email.";
	const validator_email = new Validator<A>(new RuleFor<A>("value").email(message_email));

	const invalid_emails: string[] = [
		"plainaddress",
		"@example.com",
		"email.example.com",
		"email@example",
	];

	it.each(invalid_emails)("should return invalid when not an email", (x) => {
		const validation = validator_email.validate({ value: x });

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).to.include(message_email);
	});

	const valid_emails: string[] = [
		"email@example.com",
		"firstname.lastname@example.com",
		"email@subdomain.example.com",
		"firstname+lastname@example.com",
		"email@123.123.123.123",
		"email@[123.123.123.123]",
		'email"@example.com',
		"1234567890@example.com",
		"email@example-one.com",
		"_______@example.com",
		"email@example.name",
		"email@example.museum",
		"email@example.co.jp",
		"firstname-lastname@example.com",
	];

	it.each(valid_emails)("should return valid when an email", (x) => {
		const validation = validator_email.validate({ value: x });

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - is string function", () => {
	type A = { value: string };
	const validator = new Validator<A>(new RuleFor<A>("value").notEmpty("Value should be ."));

	// IS STRING

	it.each([true, 1234])(
		"should throw an error when not a string and using a string check",
		(x) => {
			expect(() => validator.validate({ value: x as any })).to.throw(
				"Expected string but got something else."
			);
		}
	);
});

describe("validations - collection validation", () => {
	type A = { value: string };
	const message = "Value is required.";
	const validator = new Validator<A>(new RuleFor<A>("value").required(message));

	it("should return invalid if all items are invalid", () => {
		const validation = validator.validateCollection([{ value: "" }, { value: null }]);

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).length(2);
	});

	it("should return invalid if any item is invalid", () => {
		const validation = validator.validateCollection([{ value: "test" }, { value: null }]);

		expect(validation.valid).toBe(false);
		expect(validation.message).to.not.be.empty;
		expect(validation.errors).length(1);
	});

	it("should return valid if all items are valid", () => {
		const validation = validator.validateCollection([{ value: "test" }, { value: "mock" }]);

		expect(validation.valid).toBe(true);
		expect(validation.message).to.be.empty;
		expect(validation.errors).to.be.empty;
	});
});

describe("validations - ensure valid", () => {
	type A = { value: string };
	const message = "Value is required.";
	const validator = new Validator<A>(new RuleFor<A>("value").required(message));

	it("should throw if invalid", () => {
		expect(() => validator.ensureValid({ value: null })).to.throw(message);
	});

	it("should not throw if valid", () => {
		expect(() => validator.ensureValid({ value: "test" })).to.not.throw();
	});
});

describe("validations - ensure valid collection", () => {
	type A = { value: string };
	const message = "Value is required.";
	const validator = new Validator<A>(new RuleFor<A>("value").required(message));

	it("should throw if all items are invalid", () => {
		expect(() => validator.ensureValidCollection([{ value: "" }, { value: null }])).to.throw();
	});

	it("should throw if any items are invalid", () => {
		expect(() =>
			validator.ensureValidCollection([{ value: "test" }, { value: null }])
		).to.throw();
	});

	it("should not throw when all items are valid", () => {
		expect(() =>
			validator.validateCollection([{ value: "test" }, { value: "mock" }])
		).to.not.throw();
	});
});
