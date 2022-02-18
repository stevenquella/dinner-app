import { RuleFor, Validator } from "$utilities/validations";
import { describe, expect, it, test } from "vitest";

describe("Shared validation tests.", () => {
	type A = { value: any };
	const message_required = "Value is required.";
	const validator_required = new Validator<A>(new RuleFor<A>("value").required(message_required));

	it.each([null, undefined, ""])("Required check invalid.", (x) => {
		const validation = validator_required.validate({ value: x });

		expect(validation.errors).to.include(message_required);
	});

	test("Required check valid", () => {
		const validation = validator_required.validate({ value: {} });

		expect(validation.errors).to.not.include(message_required);
	});

	test("Must check valid.", () => {
		const message = "Value is good.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => true, message));
		const validation = validator.validate({ value: {} });

		expect(validation.errors).to.not.include(message);
	});

	test("Must check invalid.", () => {
		const message = "Value is bad.";
		const validator = new Validator<A>(new RuleFor<A>("value").must((_) => false, message));
		const validation = validator.validate({ value: {} });

		expect(validation.errors).to.include(message);
	});
});

describe("String validation tests.", () => {
	type A = { value: string };

	// NOT EMPTY
	const message_notempty = "Value must not be empty.";
	const validator_notempty = new Validator<A>(new RuleFor<A>("value").notEmpty(message_notempty));

	it.each([null, undefined, "", " ", "\t"])("Not empty check invalid.", (x) => {
		const validation = validator_notempty.validate({ value: x });
		expect(validation.errors).to.include(message_notempty);
	});

	test("Not empty check valid", () => {
		const validation = validator_notempty.validate({ value: "a" });
		expect(validation.errors).to.not.include(message_notempty);
	});

	// MIN LENGTH
	const message_minlength = "Value must be at least 4 characters.";
	const validator_minlength = new Validator<A>(
		new RuleFor<A>("value").minLength(4, message_minlength)
	);

	it.each(["", "a", "abc "])("Min length check invalid.", (x) => {
		const validation = validator_minlength.validate({ value: x });
		expect(validation.errors).to.include(message_minlength);
	});

	it.each(["asdf", "asdfasdf"])("Min length check valid", (x) => {
		const validation = validator_minlength.validate({ value: x });
		expect(validation.errors).to.not.include(message_minlength);
	});

	// MAX LENGTH
	const message_maxlength = "Value must be no greater than 4 characters.";
	const validator_maxlength = new Validator<A>(
		new RuleFor<A>("value").maxLength(4, message_maxlength)
	);

	it.each(["asdfa", "asdfasdf"])("Max length check invalid", (x) => {
		const validation = validator_maxlength.validate({ value: x });
		expect(validation.errors).to.include(message_maxlength);
	});

	it.each(["", "a", "abcd"])("Max length check valid.", (x) => {
		const validation = validator_maxlength.validate({ value: x });
		expect(validation.errors).to.not.include(message_maxlength);
	});

	// EMAIL
	const message_email = "Value requires a valid email.";
	const validator_email = new Validator<A>(new RuleFor<A>("value").email(message_email));

	const invalid_emails: string[] = [
		"plainaddress",
		"@example.com",
		"email.example.com",
		"email@example",
	];

	it.each(invalid_emails)("Email check invalid.", (x) => {
		const validation = validator_email.validate({ value: x });

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

	it.each(valid_emails)("Email check valid.", (x) => {
		const validation = validator_email.validate({ value: x });

		expect(validation.errors).to.not.include(message_email);
	});

	// IS STRING

	it.each([true, 1234])("IsString invalid.", (x) => {
		expect(() => validator_notempty.validate({ value: x as any })).to.throw(
			"Expected string but got something else."
		);
	});
});

// TODO ensure valid

// TODO ensure valid collection

// TODO validate collection
