import { AddCommentDTO, AddCommentRepository, AddCommentRequestDTO, AddCommentResponseDTO } from "./index";
import { Comment, CommentProps, Source } from "../entities";
import { Guard, Result, UnexpectedError, UniqueEntityID, UseCase } from "../../shared/domain";
import { HandleModeration } from "../handle-moderation/HandleModeration";
import { InappropriateStrategy } from "../handle-moderation/InappropriateStrategy";
import { SpamStrategy } from "../handle-moderation/SpamStrategy";


export class AddComment implements UseCase<AddCommentRequestDTO, AddCommentResponseDTO> {
  private addCommentRepository: AddCommentRepository;
  private readonly inappropriateStrategy: InappropriateStrategy;
  private readonly spamStrategy: SpamStrategy;
  private comment: Comment;

  public constructor(
    addCommentRepository: AddCommentRepository,
    inappropriateStrategy: InappropriateStrategy,
    spamStrategy: SpamStrategy
  ) {
    this.addCommentRepository = addCommentRepository;
    this.inappropriateStrategy = inappropriateStrategy;
    this.spamStrategy = spamStrategy;
  }

  public async execute(request: AddCommentRequestDTO): Promise<AddCommentResponseDTO> {
    const entitiesErrors = this.getEntitiesErrors(request);
    const guardErrors = Guard.againstNullOrUndefined(entitiesErrors, "entitiesErrors");
    if (guardErrors.succeeded) {
      return entitiesErrors;
    }
    try {
      const existComment = await this.addCommentRepository.findByHash(this.comment.getHash);
      const guardExistComment = Guard.againstNullOrUndefined(existComment, "existComment");
      if (guardExistComment.succeeded) {
        return Result.ok<AddCommentDTO>(existComment);
      }
      const handleModeration = new HandleModeration(this.inappropriateStrategy, this.spamStrategy);
      if (await handleModeration.isQuestionable(this.comment)) {
        this.comment.unPublish();
      } else {
        this.comment.publish();
      }
      await this.addCommentRepository.save(this.comment);

      return Result.ok<AddCommentDTO>(this.buildCommentDTO());
    } catch (e) {
      return new UnexpectedError();
    }
  }

  private buildCommentDTO(): AddCommentDTO {
    const replyToId = this.comment.getReplyToId ? { replyToId: this.comment.getReplyToId.toString() } : {};

    return {
      id: this.comment.getId.toString(),
      author: this.comment.getAuthor,
      text: this.comment.getText,
      createdAt: this.comment.getCreatedAt,
      lastModifiedAt: this.comment.getLastModifiedAt,
      postId: this.comment.getPostId,
      published: this.comment.getIsPublished,
      hash: this.comment.getHash,
      ...replyToId
    };
  }

  private getEntitiesErrors(request: AddCommentRequestDTO): Result<void> | null {
    const sourceOrError = Source.create(request.ip, request.browser, request.referrer);
    if (!sourceOrError.isSuccess) {
      return Result.fail(sourceOrError.error);
    }
    const replyToId = request.replyToId ? { replyToId: new UniqueEntityID(request.replyToId) } : {};
    const commentProps: CommentProps = {
      id: new UniqueEntityID(),
      author: request.author,
      postId: request.postId,
      text: request.text,
      source: sourceOrError.getValue,
      ...replyToId
    };
    const commentOrError = Comment.create(commentProps);
    if (!commentOrError.isSuccess) {
      return Result.fail(commentOrError.error);
    }
    // TODO: Refactor this to accomplish SRP for live demo purposes
    this.comment = commentOrError.getValue;

    return null;
  }
}
