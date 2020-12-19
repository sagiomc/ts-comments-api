import {
  AddCommentController,
  DeleteCommentController,
  EditCommentController,
  ListCommentsController
} from "../controllers";
import { CommentDomain } from "../../../domain/CommentDomain";
import { Router } from "express";
import { app } from "../../iocRegister";

const commentsRoutes = Router();
const commentDomain: CommentDomain = app.commentMain;
const addCommentController = new AddCommentController(commentDomain.addComment);
const editCommentController = new EditCommentController(commentDomain.editComment);
const deleteCommentController = new DeleteCommentController(commentDomain.deleteComment);
const listCommentsController = new ListCommentsController(commentDomain.listComments);

commentsRoutes.get("/", (req, res) =>
  listCommentsController.execute(req, res)
);

commentsRoutes.post("/", (req, res) =>
  addCommentController.execute(req, res)
);

commentsRoutes.patch("/:id", (req, res) =>
  editCommentController.execute(req, res)
);

commentsRoutes.delete("/:id", (req, res) =>
  deleteCommentController.execute(req, res)
);

export { commentsRoutes };
