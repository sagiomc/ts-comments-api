import { Hasher } from "../../../../src/shared/domain";

describe("Hash rules", () => {
  it("should create a md5 hash in createMd5()", () => {
    const myMd5Hash = Hasher.createMd5("stringforunittestpurposes");
    expect(myMd5Hash).toEqual("ec2efd0c0ff533d25edbbf40126321bd");
  });
});
