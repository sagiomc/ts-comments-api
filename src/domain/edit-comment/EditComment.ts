import { EditCommentDTO, EditCommentResponseDTO } from "./EditCommentResponseDTO";
import { Result, UnexpectedError, UseCase } from "../../shared/domain";
import { Comment } from "../entities";
import { EditCommentRepository } from "./EditCommentRepository";
import { EditCommentRequestDTO } from "./EditCommentRequestDTO";
import { HandleModeration } from "../handle-moderation/HandleModeration";
import { InappropriateStrategy } from "../handle-moderation/InappropriateStrategy";
import { SpamStrategy } from "../handle-moderation/SpamStrategy";


export class EditComment implements UseCase<EditCommentRequestDTO, EditCommentResponseDTO>{
  private editCommentRepository: EditCommentRepository;
  private readonly inappropriateStrategy: InappropriateStrategy;
  private readonly spamStrategy: SpamStrategy;
  private comment: Comment;

  public constructor(
    editCommentRepository: EditCommentRepository,
    inappropriateStrategy: InappropriateStrategy,
    spamStrategy: SpamStrategy
  ) {
    this.editCommentRepository = editCommentRepository;
    this.inappropriateStrategy = inappropriateStrategy;
    this.spamStrategy = spamStrategy;
  }

  public async execute(request: EditCommentRequestDTO): Promise<EditCommentResponseDTO> {
    let previousHash: string;
    try {
      const isCommentFound = await this.editCommentRepository.findById(request.id);
      if (!isCommentFound) {
        return Result.fail<void>("Comment not found.");
      }
      this.comment = isCommentFound;
      previousHash = this.comment.getHash;
      this.modifyComment(request);
      if(previousHash === this.comment.getHash) {
        return Result.ok<EditCommentDTO>(this.buildResponseDTO());
      }
      await this.moderateComment();
      await this.editCommentRepository.update(this.comment);

      return Result.ok<EditCommentDTO>(this.buildResponseDTO());
    } catch (e) {
      return new UnexpectedError();
    }
  }

  public buildResponseDTO (): EditCommentDTO {
    return {
      id: this.comment.getId.toString(),
      text: this.comment.getText,
      lastModifiedAt: this.comment.getLastModifiedAt,
      hash: this.comment.getHash,
      published: this.comment.getIsPublished
    };
  }

  public modifyComment(commentRequest: EditCommentRequestDTO): void {
    this.comment.setLastModifiedAt = new Date();
    this.comment.setText = commentRequest.text;
    this.comment.buildHash();
  }

  private async moderateComment(): Promise<void> {
    const handleModeration = new HandleModeration(this.inappropriateStrategy, this.spamStrategy);
    if (await handleModeration.isQuestionable(this.comment)) {
      this.comment.unPublish();
    } else {
      this.comment.publish();
    }
  }
}
