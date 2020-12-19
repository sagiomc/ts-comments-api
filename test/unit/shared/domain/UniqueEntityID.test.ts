import * as faker from "faker";
import { UniqueEntityID } from "../../../../src/shared/domain";

describe("UniqueEntityID ", () => {
  it("should be false when pass a invalid id in class construction", () => {
    const invalidId = "112432421";
    const uniqueEntityIdObject = new UniqueEntityID(invalidId);
    expect(uniqueEntityIdObject.isValidId()).toBe(false);
  });

  it("should be true when pass a valid id in class construction", () => {
    const validId = faker.random.uuid();
    const uniqueEntityIdObject = new UniqueEntityID(validId);
    expect(uniqueEntityIdObject.isValidId()).toBe(true);
  });
});
