import { AddCommentDTO } from "./AddCommentResponseDTO";
import { Comment } from "../entities";

export interface AddCommentRepository {
  findByHash(hash: string): Promise<AddCommentDTO | null>;
  save(comment: Comment): Promise<void>;
}
