export function getErrorMessage(error: any): string | null {
  if (error == null) {
    return null;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return `${error}`;
  }
}
