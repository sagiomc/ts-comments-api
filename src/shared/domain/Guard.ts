export interface GuardResult {
  succeeded: boolean;
  message?: string;
}

export interface GuardArgument<T> {
  argument: T;
  argumentName: string;
}

export type GuardArgumentCollection = Array<GuardArgument<unknown>>;

export class Guard {
  public static againstNullOrUndefined(argument: unknown, argumentName: string): GuardResult {
    if (argument === null || typeof argument === "undefined") {
      return {succeeded: false, message: `${argumentName} is null or undefined`};
    } else {
      return {succeeded: true};
    }
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): GuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (result.succeeded === false) {
        return result;
      }
    }

    return {succeeded: true};
  }
}


