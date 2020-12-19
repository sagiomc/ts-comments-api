import { ListComments, ListCommentsResponseDTO } from "../../../domain/list-comments";
import { Request, Response } from "express";
import { BaseController } from "../../../shared/frameworks/BaseController";
import { UnexpectedError } from "../../../shared/domain";

export class ListCommentsController extends BaseController {

  public constructor(
    private listComments: ListComments
  ) {
    super();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void | Response> {
    let resultUseCase;
    try {
      const inputPostId = req.query.postId as string;
      resultUseCase = await this.listComments.execute({ postId: inputPostId });
      if (resultUseCase.error) {
        if (resultUseCase instanceof UnexpectedError) {
          return this.fail(res, resultUseCase.error);
        } else {
          return this.badRequest(res, resultUseCase.error);
        }
      } else {
        resultUseCase = resultUseCase.getValue as ListCommentsResponseDTO;

        return this.ok(res, resultUseCase);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
