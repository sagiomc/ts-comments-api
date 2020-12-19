import { Guard, Result, UnexpectedError, UseCase } from "../../shared/domain";
import { ListCommentDTO, ListCommentsResponseDTO } from "./ListCommentsResponseDTO";
import { ListCommentsRepository } from "./ListCommentsRepository";
import { ListCommentsRequestDTO } from "./ListCommentsRequestDTO";

export class ListComments implements UseCase<ListCommentsRequestDTO, ListCommentsResponseDTO> {
  private listCommentsRepository: ListCommentsRepository;
  private listComment: Array<ListCommentDTO> = [];
  private readonly emptyList: Array<ListCommentDTO> = [];

  public constructor(listCommentsRepository: ListCommentsRepository) {
    this.listCommentsRepository = listCommentsRepository;
  }

  public async execute(request: ListCommentsRequestDTO): Promise<ListCommentsResponseDTO> {
    const isValidPostId = Guard.againstNullOrUndefined(request.postId, "postId").succeeded;
    if (!isValidPostId) {
      return Result.fail<void>("You must supply a post id.");
    }
    try {
      this.listComment = await this.listCommentsRepository.findByPostId(request.postId);
      if (this.listComment.length <= 0) {
        return Result.ok(this.emptyList);
      }
      this.listComment = this.nestedComments(this.listComment);

      return Result.ok(this.listComment);
    } catch (e) {
      return new UnexpectedError();
    }
  }

  // TODO: If this gets slow introduce caching.
  public nestedComments(commentsList: Array<ListCommentDTO>): Array<ListCommentDTO> {
    return commentsList.reduce((nested, comment) => {
      comment.replies = commentsList.filter(
        (reply) => reply.replyToId === comment.id
      );
      this.nestedComments(comment.replies);
      if (comment.replyToId === null || typeof comment.replyToId === "undefined") {
        nested.push(comment);
      }

      return nested;
    }, []);
  }
}
