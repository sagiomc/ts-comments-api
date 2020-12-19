import { AuditableData, AuditableEntity, Guard, Hasher, Result, UniqueEntityID } from "../../shared/domain";
import { Source } from "./Source";

export type CommentProps = {
  author: string;
  id: UniqueEntityID;
  postId: string;
  text: string;
  source: Source;
  replyToId?: UniqueEntityID;
  auditableData?: AuditableData;
};

const VALID_LENGTH_AUTHOR = 3;

export class Comment extends AuditableEntity {

  private author: string;
  private id: UniqueEntityID;
  private postId: string;
  private text: string;
  private source: Source;
  private replyToId: UniqueEntityID;
  private deletedText = ".xX This comment has been deleted Xx.";
  private published = true;
  private hash: string;

  public constructor(props: CommentProps) {
    super(props.auditableData ? props.auditableData : { createdBy: props.author });
    this.author = props.author;
    this.id = props.id;
    this.postId = props.postId;
    this.text = props.text;
    this.source = props.source;
    this.replyToId = props.replyToId;
  }

  public static create(props: CommentProps): Result<Comment> {
    const nullOrUndefinedGuard = Guard.againstNullOrUndefinedBulk([
      {argumentName: "author", argument: props.author},
      {argumentName: "id", argument: props.id},
      {argumentName: "postId", argument: props.postId},
      {argumentName: "text", argument: props.text},
      {argumentName: "source", argument: props.source}
    ]);
    if (nullOrUndefinedGuard.succeeded === false) {
      return Result.fail(nullOrUndefinedGuard.message);
    } else {
      if (props.author.length < VALID_LENGTH_AUTHOR) {
        return Result.fail("Comment author's name must be longer than 2 characters.");
      }
      if (props.id.isValidId() === false) {
        return Result.fail("Comment must have a valid id.");
      }
      if (props.replyToId && props.replyToId.isValidId() === false) {
        return Result.fail("If supplied. Comment must contain a valid replyToId.");
      }
    }
    const comment = new Comment(props);
    comment.buildHash();

    return Result.ok<Comment>(comment);
  }

  public get getAuthor(): string {
    return this.author;
  }

  public get getId(): UniqueEntityID {
    return this.id;
  }

  public get getPostId(): string {
    return this.postId;
  }

  public get getText(): string {
    return this.text;
  }

  public set setText(newText: string) {
    this.text = newText;
  }

  public get getSource(): Source {
    return this.source;
  }

  public get getReplyToId(): UniqueEntityID {
    return this.replyToId;
  }

  public get getIsDeleted(): boolean {
    return this.deletedText === this.text;
  }

  public get getIsPublished(): boolean {
    return this.published;
  }

  public get getHash(): string {
    return this.hash;
  }

  public publish(): void {
    this.published = true;
  }

  public unPublish(): void {
    this.published = false;
  }

  public markDeleted(): void {
    this.text = this.deletedText;
    this.setLastModifiedAt = new Date();
    this.author = "Deleted";
  }

  public buildHash(): void {
    this.hash = Hasher.createMd5(
      this.text + this.published +
      this.author + this.postId +
      (this.replyToId || "")
    );
  }
}
