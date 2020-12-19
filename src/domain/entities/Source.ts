import { Guard, Result } from "../../shared/domain";
import { TextUtils } from "../../shared/TextUtils";

export class Source {

  private readonly ip: string;
  private readonly browser: string;
  private readonly referrer: string;

  private constructor(ip: string, browser: string, referrer: string) {
    this.ip = ip;
    this.browser = browser;
    this.referrer = referrer;
  }

  public get getIp(): string {
    return this.ip;
  }

  public get getBrowser(): string {
    return this.browser;
  }

  public get getReferrer(): string {
    return this.referrer;
  }

  public static create(ip: string, browser: string, referrer: string): Result<Source> {
    const ipGuardResult = Guard.againstNullOrUndefined(ip, "ip");
    if (ipGuardResult.succeeded === false) {
      return Result.fail(ipGuardResult.message);
    }
    if (TextUtils.isValidIp(ip) === false) {
      return Result.fail("Comment source must contain a valid IP.");
    }

    const source = new Source(ip, browser, referrer);

    return Result.ok<Source>(source);
  }
}
