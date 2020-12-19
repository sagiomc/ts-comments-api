import { AddComment, AddCommentRequestDTO } from "../../../domain/add-comment";
import { BaseController, CodeHttp } from "../../../shared/frameworks/BaseController";
import { Request, Response } from "express";
import { TextUtils } from "../../../shared/TextUtils";

export class AddCommentController extends BaseController {
  private addComment: AddComment;

  public constructor(addComment: AddComment) {
    super();
    this.addComment = addComment;
  }

  public buildDTO(httpRequest: Request): AddCommentRequestDTO {
    const userAgent = httpRequest.headers["user-agent"];
    const referrer = httpRequest.headers.referer;
    const dtoResponse: AddCommentRequestDTO = {
      postId: httpRequest.body.postId,
      author: httpRequest.body.author,
      text: TextUtils.sanitize(httpRequest.body.text),
      ip: httpRequest.ip,
      referrer: referrer,
      browser: userAgent
    };

    if (httpRequest.body.replyToId) {
      dtoResponse.replyToId = httpRequest.body.replyToId;
    }

    return dtoResponse;
  }

  protected async executeImpl(req: Request, res: Response): Promise<Response> {
    try {
      const dto = this.buildDTO(req);
      const useCaseResult = await this.addComment.execute(dto);

      if (useCaseResult.error) {
        return this.badRequest(res, useCaseResult.error);
      }

      return this.ok(res, useCaseResult.getValue, CodeHttp.CREATED);
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
