import { createHash } from "crypto";

export class Hasher {
  public static createMd5(text: string): string {
    return createHash("md5")
      .update(text, "utf8")
      .digest("hex");
  }
}
