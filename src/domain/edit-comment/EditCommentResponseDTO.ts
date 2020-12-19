import { Result } from "../../shared/domain";

export type EditCommentResponseDTO = Result<EditCommentDTO> | Result<void>;
export type EditCommentDTO = {
  id: string;
  text: string;
  lastModifiedAt: Date;
  hash: string;
  published: boolean;
};
