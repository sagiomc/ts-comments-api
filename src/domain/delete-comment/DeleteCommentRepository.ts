import { Comment } from "../entities";

export interface DeleteCommentRepository {
  findReplies(id: string, publishOnly: boolean): Promise<Array<Comment> | []>;
  remove(id: string): Promise<void>;
}
