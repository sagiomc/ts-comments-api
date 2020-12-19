import { Result } from "../../shared/domain";

export type ListCommentsResponseDTO = Result<Array<ListCommentDTO>> | Result<void>;
export type ListCommentDTO = {
  id: string;
  author: string;
  postId: string;
  text: string;
  createdAt: Date;
  lastModifiedAt: Date;
  published: boolean;
  replyToId?: string;
  replies?: Array<ListCommentDTO>;
};
