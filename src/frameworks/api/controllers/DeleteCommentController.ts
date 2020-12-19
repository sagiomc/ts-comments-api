import { DeleteComment, DeleteCommentDTO } from "../../../domain/delete-comment";
import { Request, Response } from "express";
import { BaseController } from "../../../shared/frameworks/BaseController";

export class DeleteCommentController extends BaseController {
  private deleteComment: DeleteComment;

  public constructor(deleteComment: DeleteComment) {
    super();
    this.deleteComment = deleteComment;
  }

  protected async executeImpl(req: Request, res: Response): Promise<Response> {
    let useCaseResult;
    const reqId = req.params.id;
    if (!reqId) {
      return this.badRequest(res, "Invalid params request, supply an valid id");
    } else {
      try {
        const dto = {id: reqId};
        useCaseResult = await this.deleteComment.execute(dto);
        useCaseResult = useCaseResult.getValue as DeleteCommentDTO;
        if (useCaseResult.deletedCount === 0) {
          return this.notFound(res, useCaseResult.message);
        } else {
          return this.ok(res, useCaseResult);
        }
      } catch (err) {
        return this.fail(res, err);
      }
    }
  }
}
