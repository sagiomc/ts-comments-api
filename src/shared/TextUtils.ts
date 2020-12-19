import { isIP } from "net";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

export class TextUtils {

  public static isValidIp(ip: string): boolean {
    return isIP(ip) !== 0;
  }

  public static isValidUuid(id: string): boolean {
    return validator.isUUID(id);
  }

  public static isValidMd5(value: string): boolean {
    return validator.isMD5(value);
  }

  public static sanitize(text: string): string {
    return sanitizeHtml(text);
  }
}
