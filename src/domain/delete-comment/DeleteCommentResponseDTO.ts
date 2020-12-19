import { Result } from "../../shared/domain";

export type DeleteCommentResponseDTO = Result<DeleteCommentDTO | void>;
export type DeleteCommentDTO = {
  message: string;
  deletedCount: number;
  softDelete: boolean;
};
