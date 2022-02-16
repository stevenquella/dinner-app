// inspired by https://github.com/AlexJPotter/fluentvalidation-ts

export class Validator<T> {
	private readonly rules: RuleFor<T>[];

	constructor(...rules: RuleFor<T>[]) {
		this.rules = rules;
	}

	validate(input: T): { valid: boolean; errors: string[]; message: string } {
		const errors: string[] = this.rules.flatMap((r) =>
			r.performChecks(input)
		);

		return {
			valid: errors.length === 0,
			errors: errors,
			message: errors.join(" "),
		};
	}
}

export class RuleFor<T> {
	private readonly name: keyof T;
	private readonly checks: ((input: T) => string)[];

	constructor(name: keyof T) {
		this.name = name;
		this.checks = [];
	}

	performChecks(input: T): string[] {
		return this.checks.map((c) => c(input)).filter((e) => !!e);
	}

	// Shared

	required(message: string) {
		return this.must((i) => RuleFor.requiredCheck(i), message);
	}

	must(check: (input: T) => boolean, message: string) {
		this.checks.push((i) => (check(i) ? null : message));
		return this;
	}

	// Strings

	notEmpty(message: string) {
		return this.must(
			(i) => RuleFor.notEmptyCheck(this.getString(i)),
			message
		);
	}

	minLength(length: number, message: string) {
		return this.must(
			(i) => RuleFor.minLengthCheck(this.getString(i), length),
			message
		);
	}

	maxLength(length: number, message: string) {
		return this.must(
			(i) => RuleFor.maxLengthCheck(this.getString(i), length),
			message
		);
	}

	email(message: string) {
		return this.must((i) => RuleFor.emailCheck(this.getString(i)), message);
	}

	// Helpers

	private getString(input: T): string {
		const value = input[this.name];

		if (!value) {
			return "";
		} else if (typeof value === "string") {
			return value;
		} else {
			console.debug(input, value);
			throw new Error("Expected string but got something else.");
		}
	}

	// Checks

	private static requiredCheck(value: any): boolean {
		return !!value;
	}

	private static notEmptyCheck(value: string): boolean {
		return !!value && value?.trim().length > 0;
	}

	private static minLengthCheck(value: string, length: number): boolean {
		return value?.length >= length;
	}

	private static maxLengthCheck(value: string, length: number): boolean {
		return value?.length <= length;
	}

	private static emailCheck(value: string): boolean {
		const emailAddressPattern =
			/^[a-zA-Z0-9.!#$%&’"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

		return emailAddressPattern.test(value);
	}
}
