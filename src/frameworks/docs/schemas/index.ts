import {
  addCommentParamsSchema,
  addCommentResponseSchema,
  deleteCommentResponseSchema,
  idSchema, listCommentsResponseSchema,
  textSchema
} from "./commentSchema";
import { errorSchema } from "./errorSchema";

export default {
  error: errorSchema,
  id: idSchema,
  text: textSchema,
  addCommentParams: addCommentParamsSchema,
  addCommentResponse: addCommentResponseSchema,
  deleteCommentResponse: deleteCommentResponseSchema,
  listCommentsResponse: listCommentsResponseSchema
};
