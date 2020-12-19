import { ListCommentDTO, ListCommentsRepository } from "../../domain/list-comments";
import { QueryBuilder, mongoHelper } from "../db";

const collectionName = "comments";

export class ListCommentsRepositoryImpl implements ListCommentsRepository {
  public async findByPostId(postId: string, omitReplies = true): Promise<Array<ListCommentDTO>> {
    let comments;
    const queryMatch = {postId: postId, replyToId: null};
    if (omitReplies) {
      delete queryMatch.replyToId;
    }
    const query = new QueryBuilder()
      .match(queryMatch)
      .sort({createdAt: 1})
      .build();
    const commentCollection = await mongoHelper.getCollection(collectionName);
    comments = await commentCollection.aggregate(query).toArray();
    comments = mongoHelper.mapCollection(comments) as Array<ListCommentDTO>;

    return comments;
  }
}
