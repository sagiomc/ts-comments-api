import { Comment, CommentProps, Source } from "../../domain/entities";
import { EditCommentRepository } from "../../domain/edit-comment";
import { UniqueEntityID } from "../../shared/domain";
import { mongoHelper } from "../db";

const collectionName = "comments";

export type CommentPersistence = {
  author: string;
  id: string;
  postId: string;
  text: string;
  createdAt: Date;
  lastModifiedAt: Date;
  published: boolean;
  hash: string;
  source: {
    ip: string;
    browser?: string;
    referrer?: string;
  };
  replyToId?: string;
};

export class EditCommentRepositoryImpl implements EditCommentRepository {
  public async findById(id: string): Promise<Comment | null> {
    let commentFound;
    const commentCollection = await mongoHelper.getCollection(collectionName);
    const comment = commentCollection.find({_id: id});
    commentFound = await comment.toArray();
    if (commentFound.length === 0) {
      return null;
    }
    commentFound = mongoHelper.map(commentFound[0]) as CommentPersistence;

    return this.toEntity(this.buildProps(commentFound));
  }

  public async update(comment: Comment): Promise<void> {
    const id = comment.getId.toString();
    const toUpdate = {
      text: comment.getText,
      hash: comment.getHash,
      published: comment.getIsPublished,
      lastModifiedAt: comment.getLastModifiedAt
    };
    const commentCollection = await mongoHelper.getCollection(collectionName);
    await commentCollection.updateOne({_id: id}, {$set: toUpdate});
  }

  public toEntity(commentProperties: CommentProps): Comment {
    return Comment.create(commentProperties).getValue;
  }

  public buildProps(commentMongo: CommentPersistence): CommentProps {
    const reply = commentMongo.replyToId ? {replyToId: new UniqueEntityID(commentMongo.replyToId)} : {};
    const response = {
      id: new UniqueEntityID(commentMongo.id),
      author: commentMongo.author,
      postId: commentMongo.postId,
      text: commentMongo.text,
      source: Source.create(commentMongo.source.ip, commentMongo.source.browser, commentMongo.source.referrer).getValue,
      auditableData: {
        createdBy: commentMongo.author,
        createdAt: commentMongo.createdAt,
        lastModifiedAt: commentMongo.lastModifiedAt
      }
    };

    return Object.assign(response, reply);
  }

}
