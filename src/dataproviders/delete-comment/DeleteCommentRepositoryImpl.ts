import { Comment } from "../../domain/entities";
import { DeleteCommentRepository } from "../../domain/delete-comment";
import { mongoHelper } from "../db";


const collectionName = "comments";

export class DeleteCommentRepositoryImpl implements DeleteCommentRepository {

  public async findReplies(id: string, publishOnly = true): Promise<Array<Comment> | []> {
    let comments;
    const commentCollection = await mongoHelper.getCollection(collectionName);
    const query = publishOnly
      ? {published: true, replyToId: id}
      : {replyToId: id};
    comments = await commentCollection.find(query).toArray();
    comments = mongoHelper.mapCollection(comments) as Array<Comment>;

    return comments;
  }

  public async remove(id: string): Promise<void> {
    const commentCollection = await mongoHelper.getCollection(collectionName);
    await commentCollection.deleteOne({_id: id});
  }
}
