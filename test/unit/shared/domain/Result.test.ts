import { Result } from "../../../../src/shared/domain";

describe("Result class", () => {
  const successObject = Result.ok("Operation OK");
  const failObject = Result.fail("This is an error");

  it("should create a success result object", () => {
    expect(successObject.isSuccess).toBe(true);
    expect(successObject.error).toBeNull();
    expect(successObject.getValue).toStrictEqual("Operation OK");
  });

  it("should create a fail result object", () => {
    expect(failObject.isSuccess).toBe(false);
    expect(failObject.error).toEqual("This is an error");
    expect(() => {
      failObject.getValue;
    }).toThrowError();
  });
});
