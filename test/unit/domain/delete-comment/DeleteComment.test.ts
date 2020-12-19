import { CommentCount, DeleteComment } from "../../../../src/domain/delete-comment";
import { UnexpectedError, UniqueEntityID } from "../../../../src/shared/domain";
import { Comment } from "../../../../src/domain/entities";
import { fakeCommentProperties } from "../../../fixtures/CommentFixture";

describe("Delete comment", () => {
  let editCommentRepository;
  let deleteCommentRepository;
  let deleteCommentUseCase;
  let parentComment;
  let replyComment;

  beforeEach(() => {

    parentComment = Comment.create(fakeCommentProperties({
      id: new UniqueEntityID("7da67822-f33e-4a9c-9f1d-ab1c614e4808")
    })).getValue;
    replyComment = Comment.create(fakeCommentProperties({
      id: new UniqueEntityID("537da030-3d6f-4520-b64f-9b6522431d24"),
      replyToId: new UniqueEntityID("7da67822-f33e-4a9c-9f1d-ab1c614e4808")
    })).getValue;

    editCommentRepository = {
      findById: jest.fn(async () => Promise.resolve(null)),
      update: jest.fn(async () => Promise.resolve())
    };

    deleteCommentRepository = {
      findReplies: jest.fn(async () => Promise.resolve([])),
      remove: jest.fn(async () => Promise.resolve())
    };

    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
  });

  it("should return an UnexpectedError if the promise fails in execute()", async () => {
    editCommentRepository.findById = jest.fn(async () => Promise.reject());
    const resultUseCase = await deleteCommentUseCase.execute({id: "a4915658-778f-4ff7-b048-2305cb765b05"});
    expect(resultUseCase).toBeInstanceOf(UnexpectedError);
  });

  it("should handle non existent comments", async () => {
    const resultUseCase = await deleteCommentUseCase.execute({id: "This id does not exists"});
    expect(editCommentRepository.findById).toHaveBeenCalled();
    expect(resultUseCase.getValue).toEqual({
      message: "Comment not found, nothing to delete.",
      softDelete: false,
      deletedCount: CommentCount.NONE
    });
  });

  it("should delete comments with zero replies in hard mode", async () => {
    const fakeComment = Comment.create(fakeCommentProperties({
      id: new UniqueEntityID("14a1b721-75e9-412f-bfb5-25d2b02ece89")
    })).getValue;
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(fakeComment));
    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
    const resultDelete = await deleteCommentUseCase.execute("14a1b721-75e9-412f-bfb5-25d2b02ece89");
    expect(editCommentRepository.update).not.toHaveBeenCalled();
    expect(resultDelete.getValue).toEqual({
      message: "Comment deleted.",
      softDelete: false,
      deletedCount: CommentCount.ONE
    });
  });

  it("should deletes comments with 1 or more replies in soft mode", async () => {
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(parentComment));
    deleteCommentRepository.findReplies = jest.fn(async () => Promise.resolve([replyComment]));
    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
    const resultDelete = await deleteCommentUseCase.execute("7da67822-f33e-4a9c-9f1d-ab1c614e4808");
    expect(resultDelete.getValue).toEqual({
      message: "Comment has replies. Soft deleted.",
      softDelete: true,
      deletedCount: CommentCount.ONE
    });
    expect(deleteCommentRepository.remove).not.toHaveBeenCalled();
  });

  it("should deletes a comment and its deleted parent when there are no other replies", async () => {
    parentComment.markDeleted();
    editCommentRepository.findById
      .mockReturnValueOnce(replyComment)
      .mockReturnValueOnce(parentComment);
    deleteCommentRepository.findReplies
      .mockReturnValueOnce([])
      .mockReturnValueOnce([replyComment]);
    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
    const resultDelete = await deleteCommentUseCase.execute("537da030-3d6f-4520-b64f-9b6522431d24");
    expect(resultDelete.getValue).toEqual({
      message: "Comment and parent deleted.",
      softDelete: false,
      deletedCount: CommentCount.PARENT_CHILD
    });
  });

  it("should deletes a child comment and it should not delete a deleted parent, when deleted parent have are other replies", async () => {
    parentComment.markDeleted();
    editCommentRepository.findById
      .mockReturnValueOnce(replyComment)
      .mockReturnValueOnce(parentComment);
    deleteCommentRepository.findReplies
      .mockReturnValueOnce([])
      .mockReturnValueOnce([replyComment, replyComment]);
    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
    const resultDelete = await deleteCommentUseCase.execute("537da030-3d6f-4520-b64f-9b6522431d24");
    expect(resultDelete.getValue).toEqual({
      message: "Comment deleted.",
      softDelete: false,
      deletedCount: CommentCount.ONE
    });
  });

  it("should deletes comments with 1 non-deleted parent and no replies in hard mode", async () => {
    const replyOfReply = Comment.create(fakeCommentProperties({
      id: new UniqueEntityID("5743fcdb-49e2-416b-a92f-e55372e3389a"),
      replyToId: new UniqueEntityID("537da030-3d6f-4520-b64f-9b6522431d24")
    })).getValue;
    editCommentRepository.findById
      .mockReturnValueOnce(replyOfReply)
      .mockReturnValueOnce(replyComment);
    deleteCommentUseCase = new DeleteComment(deleteCommentRepository, editCommentRepository);
    const resultDelete = await deleteCommentUseCase.execute("5743fcdb-49e2-416b-a92f-e55372e3389a");
    expect(resultDelete.getValue).toEqual({
      message: "Comment deleted.",
      softDelete: false,
      deletedCount: CommentCount.ONE
    });
  });
});
