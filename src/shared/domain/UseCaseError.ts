export class UseCaseError extends Error {

  public constructor(message: string) {
    super(message);
    this.name = this.getErrorType;
  }

  public get getErrorType(): string {
    return this.constructor.name.toUpperCase();
  }
}
