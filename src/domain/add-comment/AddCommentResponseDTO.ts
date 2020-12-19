import { Result } from "../../shared/domain";

export type AddCommentResponseDTO = Result<AddCommentDTO> | Result<void>;
export type AddCommentDTO = {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
  postId: string;
  published: boolean;
  hash: string;
  lastModifiedAt: Date;
  replyToId?: string;
};
