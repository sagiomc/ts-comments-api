import { DeleteCommentDTO, DeleteCommentResponseDTO } from "./DeleteCommentResponseDTO";
import { Result, UnexpectedError, UseCase } from "../../shared/domain";
import { Comment } from "../entities";
import { DeleteCommentRepository } from "./DeleteCommentRepository";
import { DeleteCommentRequestDTO } from "./DeleteCommentRequestDTO";
import { EditCommentRepository } from "../edit-comment";

export enum CommentCount {
  NONE,
  ONE,
  PARENT_CHILD
}

export class DeleteComment implements UseCase<DeleteCommentRequestDTO, DeleteCommentResponseDTO> {
  private deleteCommentRepository: DeleteCommentRepository;
  private editCommentRepository: EditCommentRepository;
  private comment: Comment;

  public constructor(
    deleteCommentRepository: DeleteCommentRepository,
    editCommentRepository: EditCommentRepository
  ) {
    this.deleteCommentRepository = deleteCommentRepository;
    this.editCommentRepository = editCommentRepository;
  }

  public async execute(request: DeleteCommentRequestDTO): Promise<DeleteCommentResponseDTO> {
    let response: DeleteCommentDTO;
    try {
      const existsComment = await this.editCommentRepository.findById(request.id);
      if (!existsComment) {
        response = this.buildResponseDTO("Comment not found, nothing to delete.");

        return Result.ok(response);
      }
      this.comment = existsComment;
      if (await this.hasReplies(request.id)) {
        response = await this.softDelete(this.comment);

        return Result.ok(response);
      }
      if (await this.isOnlyReplyOfDeletedParent(this.comment)) {
        response = await this.deleteCommentAndParent(this.comment);

        return Result.ok(response);
      }
      response = await this.hardDelete(this.comment);

      return Result.ok(response);
    } catch (e) {
      return new UnexpectedError();
    }
  }

  public buildResponseDTO(message: string, deletedCount = CommentCount.NONE, softDelete = false): DeleteCommentDTO {
    return {
      message: message,
      deletedCount: deletedCount,
      softDelete: softDelete
    };
  }

  public async isOnlyReplyOfDeletedParent(commentToDelete: Comment): Promise<boolean> {
    if (!commentToDelete.getReplyToId) {
      return false;
    } else {
      const parent = await this.editCommentRepository.findById(commentToDelete.getReplyToId.toString());
      if (parent && parent.getIsDeleted) {
        const replies = await this.deleteCommentRepository.findReplies(parent.getId.toString(), false);

        return replies.length === 1;
      }

      return false;
    }
  }

  public async softDelete(commentToSoftDelete: Comment): Promise<DeleteCommentDTO> {
    commentToSoftDelete.markDeleted();
    await this.editCommentRepository.update(commentToSoftDelete);

    return this.buildResponseDTO("Comment has replies. Soft deleted.", CommentCount.ONE, true);
  }

  public async hardDelete(commentToDelete: Comment): Promise<DeleteCommentDTO> {
    await this.deleteCommentRepository.remove(commentToDelete.getId.toString());

    return this.buildResponseDTO("Comment deleted.", CommentCount.ONE, false);
  }

  public async deleteCommentAndParent(replyComment: Comment): Promise<DeleteCommentDTO> {
    await Promise.all([
      this.deleteCommentRepository.remove(replyComment.getReplyToId.toString()),
      this.deleteCommentRepository.remove(replyComment.getId.toString())
    ]);

    return this.buildResponseDTO("Comment and parent deleted.", CommentCount.PARENT_CHILD);
  }


  private async hasReplies(id: string): Promise<boolean> {
    const replies = await this.deleteCommentRepository.findReplies(id, false);

    return replies.length > 0;
  }
}
