import { ListCommentDTO } from "./ListCommentsResponseDTO";

export interface ListCommentsRepository {
  findByPostId(postId: string, omitReplies?: boolean): Promise<Array<ListCommentDTO>>;
}
