export class Validator<T> {
	private readonly rules: RuleFor<T>[];

	constructor(...rules: RuleFor<T>[]) {
		this.rules = rules;
	}

	validate(input: T): { valid: boolean; errors: string[]; message: string } {
		const errors: string[] = this.rules
			.flatMap((rules) => {
				return rules.checks.map((check) => check(input));
			})
			.filter((error) => error != null);

		return {
			valid: errors.length === 0,
			errors: errors,
			message: errors.join(", "),
		};
	}
}

abstract class RuleFor<T> {
	protected readonly name: keyof T;
	public readonly checks: ((input: T) => string)[];

	constructor(name: keyof T) {
		this.name = name;
		this.checks = [];
	}

	must(check: (input: T) => string) {
		this.checks.push(check);
		return this;
	}

	required(message: string) {
		this.must((i) => requiredCheck(i, message));
		return this;
	}
}

export class RuleForString<T> extends RuleFor<T> {
	constructor(name: keyof T) {
		super(name);

		this.must(isStringCheck);
	}

	notEmpty(message: string) {
		this.must((i) => notEmptyCheck(this.getString(i), message));
		return this;
	}

	private getString(input: T): string {
		return input[this.name as string] as string;
	}
}

function isString(value: any): boolean {
	return typeof value === "string";
}

function isStringCheck(value: any) {
	return isString(value) ? null : "Value is not a string.";
}

const requiredCheck = function (value: any, message: string) {
	return value ? null : message;
};

const notEmptyCheck = function (value: string, message: string) {
	return isString(value) && value && value.length > 0 ? null : message;
};
