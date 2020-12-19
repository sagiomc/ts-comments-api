import { UseCaseError } from "../../../../src/shared/domain";

describe("Use Case Error", () => {
  it("should generate an error object", () => {
    const errorObject = new UseCaseError("Error: This is a test error");
    expect(errorObject).toBeInstanceOf(Error);
    expect(errorObject.getErrorType).toEqual("USECASEERROR");
    expect(errorObject.message).toEqual("Error: This is a test error");
  });
});
