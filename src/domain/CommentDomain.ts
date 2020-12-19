import { AddComment } from "./add-comment";
import { DeleteComment } from "./delete-comment";
import { EditComment } from "./edit-comment";
import { ListComments } from "./list-comments";

export class CommentDomain {
  public constructor(
    public addComment: AddComment,
    public listComments: ListComments,
    public editComment: EditComment,
    public deleteComment: DeleteComment
  ) {
  }
}
