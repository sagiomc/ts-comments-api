import { Result } from "./Result";

export class UnexpectedError extends Result<void> {
  // TODO: Implement logger here?
  public constructor() {
    super(false, "An unexpected error occurred.");
  }
}
