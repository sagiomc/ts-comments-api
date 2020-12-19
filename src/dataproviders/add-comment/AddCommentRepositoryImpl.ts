import { AddCommentDTO, AddCommentRepository } from "../../domain/add-comment";
import { Comment } from "../../domain/entities";
import { mongoHelper } from "../db";

const collectionName = "comments";

export class AddCommentRepositoryImpl implements AddCommentRepository {
  public async findByHash(hash: string): Promise<AddCommentDTO | null> {
    let commentFound;
    const commentCollection = await mongoHelper.getCollection(collectionName);
    const comment = commentCollection.find({hash: hash});
    commentFound = await comment.toArray();
    if (commentFound.length === 0) {
      return null;
    }
    commentFound = mongoHelper.map(commentFound[0]) as AddCommentDTO;

    return commentFound;
  }

  public async save(comment: Comment): Promise<void> {
    const commentCollection = await mongoHelper.getCollection(collectionName);
    await commentCollection.insertOne(this.toPersistence(comment));
  }

  public toPersistence(comment: Comment): object {
    return {
      _id: comment.getId.toString(),
      author: comment.getAuthor,
      postId: comment.getPostId,
      text: comment.getText,
      hash: comment.getHash,
      published: comment.getIsPublished,
      createdAt: comment.getCreatedAt,
      lastModifiedAt: comment.getLastModifiedAt,
      replyToId: comment.getReplyToId ? comment.getReplyToId.toString() : null,
      source: {
        ip: comment.getSource.getIp,
        browser: comment.getSource.getBrowser,
        referrer: comment.getSource.getReferrer
      }
    };
  }
}
