import { TextUtils } from "../../../src/shared/TextUtils";

describe("Text Utils ", () => {
  it("should validate an ip version 4 in isValidIp()", () => {
    const invalidIpv4 = "256.255.255.255";
    expect(TextUtils.isValidIp(invalidIpv4)).toBeFalsy();
  });

  it("should validate an ip version 6 in isValidIp()", () => {
    const invalidIpv6 = "2002:99:0:0eab:dead::a0:abcd:4e";
    expect(TextUtils.isValidIp(invalidIpv6)).toBeFalsy();
  });

  it("should validate an uuid string in isValidUuid()", () => {
    const invalidUuid = "test-custom-id-0001";
    expect(TextUtils.isValidUuid(invalidUuid)).toBeFalsy();
  });

  it("should validate an md5 hash in isValidMd5()", () => {
    const invalidMd5Hash = "custom-hash";
    expect(TextUtils.isValidMd5(invalidMd5Hash)).toBeFalsy();
  });

  it("should sanitize html text", () => {
    const thisIsFine = "<p>This is fine</p>";
    const totallyInsane = "<script>All your base are belong to us!</script>";
    expect(TextUtils.sanitize(totallyInsane)).toEqual("");
    expect(TextUtils.sanitize(thisIsFine)).toEqual("<p>This is fine</p>");
  });
});
