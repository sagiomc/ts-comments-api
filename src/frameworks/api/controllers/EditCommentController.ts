import { EditComment, EditCommentRequestDTO, EditCommentResponseDTO } from "../../../domain/edit-comment";
import { Request, Response } from "express";
import { BaseController } from "../../../shared/frameworks/BaseController";
import { TextUtils } from "../../../shared/TextUtils";

export class EditCommentController extends BaseController {
  public constructor(
    private editComment: EditComment
  ) {
    super();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void | Response> {
    let useCaseResult;
    if (!req.params.id || !req.body.text) {
      return this.badRequest(res, "Invalid params request, supply an valid id and text");
    } else {
      try {
        const dto: EditCommentRequestDTO = {
          id: req.params.id,
          text: TextUtils.sanitize(req.body.text)
        };
        useCaseResult = await this.editComment.execute(dto);
        if (useCaseResult.error) {
          return this.notFound(res, useCaseResult.error);
        } else {
          useCaseResult = useCaseResult.getValue as EditCommentResponseDTO;

          return this.ok(res, useCaseResult);
        }
      } catch (err) {
        return this.fail(res, err);
      }
    }
  }
}
