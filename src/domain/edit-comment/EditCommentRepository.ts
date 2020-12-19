import { Comment } from "../entities";

export interface EditCommentRepository {
  findById(id: string): Promise<Comment | null>;
  update(comment: Comment): Promise<void>;
}
