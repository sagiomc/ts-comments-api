import { Source } from "../../../../src/domain/entities";

describe("Comment Source", () => {

  it("create a valid source", () => {
    const sourceResult = Source.create("127.0.0.1", "browser", "referrer");
    expect(sourceResult.isSuccess).toBe(true);
    expect(sourceResult.getValue.getIp).toBe("127.0.0.1");
    expect(sourceResult.getValue.getBrowser).toBe("browser");
    expect(sourceResult.getValue.getReferrer).toBe("referrer");
  });

  it("must contain an ip", () => {
    const sourceResult = Source.create(null, "browser", "referrer");
    expect(sourceResult.isSuccess).toBe(false);
  });

  it("must have a valid ip", () => {
    const invalidIp = "256.256.256.256";
    const sourceResult = Source.create(invalidIp, "browser", "referrer");
    expect(sourceResult.isSuccess).toBe(false);
  });
});
