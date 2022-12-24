export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  } else {
    return `${error}`;
  }
}
