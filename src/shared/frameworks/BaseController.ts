import { Request, Response } from "express";

export enum CodeHttp {
  OK = 200,
  CREATED,
  BAD_REQUEST = 400,
  UNAUTHORIZED,
  FORBIDDEN = 403,
  NOT_FOUND,
  CONFLICT = 409,
  SERVER_ERROR = 500
}

export abstract class BaseController {

  public static jsonResponse (res: Response, code: number, message: string): Response {
    return res.status(code).json({ message });
  }

  public async execute (req: Request, res: Response): Promise<void | Response> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      this.fail(res, "An unexpected error occurred");
    }
  }

  public ok<T> (res: Response, dto?: T, created?: CodeHttp): Response {
    const codeHttp = created || CodeHttp.OK;
    if (dto) {
      res.type("application/json");

      return res.status(codeHttp).json(dto);
    } else {
      return res.sendStatus(codeHttp);
    }
  }

  public badRequest (res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, CodeHttp.BAD_REQUEST, message ? message : "BadRequest");
  }

  public unauthorized (res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, CodeHttp.UNAUTHORIZED, message ? message : "Unauthorized");
  }

  public notFound (res: Response, message?: string): Response {
    return BaseController.jsonResponse(res, CodeHttp.NOT_FOUND, message ? message : "Not found");
  }

  public fail (res: Response, error: Error | string): Response {
    return res.status(CodeHttp.SERVER_ERROR).json({
      message: error.toString()
    });
  }

  protected abstract executeImpl(req: Request, res: Response): Promise<void | Response>;
}
