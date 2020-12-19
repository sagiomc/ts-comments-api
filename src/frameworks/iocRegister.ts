import { InjectionMode, asClass, createContainer } from "awilix";
import { AddComment } from "../domain/add-comment";
import { AddCommentRepositoryImpl } from "../dataproviders/add-comment/AddCommentRepositoryImpl";
import { CommentDomain } from "../domain/CommentDomain";
import { DeleteComment } from "../domain/delete-comment";
import { DeleteCommentRepositoryImpl } from "../dataproviders/delete-comment/DeleteCommentRepositoryImpl";
import { EditComment } from "../domain/edit-comment";
import { EditCommentRepositoryImpl } from "../dataproviders/edit-comment/EditCommentRepositoryImpl";
import { HandleModeration } from "../domain/handle-moderation/HandleModeration";
import { InappropriateModerationImpl } from "../dataproviders/handle-moderation/InappropriateModerationImpl";
import { ListComments } from "../domain/list-comments";
import { ListCommentsRepositoryImpl } from "../dataproviders/list-comments/ListCommentsRepositoryImpl";
import { SpamModerationImpl } from "../dataproviders/handle-moderation/SpamModerationImpl";


const iocRegister = createContainer({ injectionMode: InjectionMode.CLASSIC });

iocRegister.register({
  commentDomain: asClass(CommentDomain),

  addComment: asClass(AddComment),
  deleteComment: asClass(DeleteComment),
  editComment: asClass(EditComment),
  handleModeration: asClass(HandleModeration),
  listComments: asClass(ListComments),

  addCommentRepository: asClass(AddCommentRepositoryImpl),
  deleteCommentRepository: asClass(DeleteCommentRepositoryImpl),
  editCommentRepository: asClass(EditCommentRepositoryImpl),
  inappropriateStrategy: asClass(InappropriateModerationImpl),
  spamStrategy: asClass(SpamModerationImpl),
  listCommentsRepository: asClass(ListCommentsRepositoryImpl)
});

const commentMain = iocRegister.resolve<CommentDomain>("commentDomain");

export const app = {
  commentMain,
  container: iocRegister
};
