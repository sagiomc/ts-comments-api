import { Identifier } from "../../../../src/shared/domain";

describe("Identifier", () => {
  const numberValue = 5558;
  let identifierOne: Identifier<number>;
  let identifierTwo: Identifier<number>;
  it("should be true to compare the exact same value from other Identifier object in equals()", () => {
    identifierOne = new Identifier(numberValue);
    identifierTwo = new Identifier(numberValue);
    expect(identifierOne.equals(identifierTwo)).toBe(true);
  });
  it("should be false to compare a different value from other Identifier object in equals()", () => {
    const otherNumber: unknown = 4445;
    expect(identifierOne.equals(otherNumber as Identifier<number>)).toBe(false);
  });

  it("should be false when pass a undefined value in equals()", () => {
    expect(identifierOne.equals(undefined)).toBe(false);
  });

  it("should be false when pass a null value in equals()", () => {
    expect(identifierOne.equals(null)).toBe(false);
  });
});
