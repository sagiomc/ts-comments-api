export class Identifier<T> {

  private readonly value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public equals(id?: Identifier<T>): boolean {
    if (id === null || typeof id === "undefined") {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.toValue() === this.value;
  }

  public toString(): string {
    return String(this.value);
  }

  public toValue(): T {
    return this.value;
  }
}
