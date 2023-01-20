export function getErrorMessage(error: any): string | null {
  if (error == null) {
    return null;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return `${error}`;
  }
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
