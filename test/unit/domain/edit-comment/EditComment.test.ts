let mockIsQuestionable = jest.fn(async () => Promise.resolve(false));
jest.mock("../../../../src/domain/handle-moderation/HandleModeration", () => {
  return {
    HandleModeration: jest.fn().mockImplementation(() => {
      return {isQuestionable: mockIsQuestionable};
    })
  };
});


import { EditComment, EditCommentDTO } from "../../../../src/domain/edit-comment";
import { Comment } from "../../../../src/domain/entities";
import { HandleModeration } from "../../../../src/domain/handle-moderation/HandleModeration";
import { UnexpectedError } from "../../../../src/shared/domain";
import { fakeCommentProperties } from "../../../fixtures/CommentFixture";
import { mocked } from "ts-jest/utils";

describe("Edit Comment", () => {
  const mockedHandleModeration = mocked(HandleModeration, true);
  let editMockRequestComment;
  let mockSpamModeration;
  let editCommentUseCase;
  let editCommentResult;
  let editCommentRepository;
  let mockInappropriateModeration;
  let fakeComment;

  beforeEach(() => {
    editMockRequestComment = {
      id: "e299494f-7755-408b-8c8d-fd5826258c8b",
      author: "Mr. Linda Corkery",
      postId: "06bf8198-fcf9-4e76-ad77-a0ae74a3b951",
      text: "Sic Mundus Creatus Est.",
      lastModifiedAt: "2020-07-07T05:13:03.375Z",
      ip: "234.78.215.213",
      hash: "767e478708d7ffe20e88fc3e07f7a311"
    };
    mockedHandleModeration.mockClear();
    mockIsQuestionable.mockClear();

    mockInappropriateModeration = {
      isInappropriate: jest.fn(async () => Promise.resolve(false))
    };
    mockSpamModeration = {
      isSpam: jest.fn(async () => Promise.resolve(false))
    };
    editCommentRepository = {
      findById: jest.fn(async () => Promise.resolve(null)),
      update: jest.fn(async () => Promise.resolve())
    };

    editCommentUseCase = new EditComment(editCommentRepository, mockInappropriateModeration, mockSpamModeration);
    fakeComment = Comment.create(fakeCommentProperties()).getValue;
  });

  it("should return an UnexpectedError if the promise fails in execute()", async () => {
    editCommentRepository.findById = jest.fn(async () => Promise.reject());
    editCommentResult = await editCommentUseCase.execute(editMockRequestComment);
    expect(editCommentResult).toBeInstanceOf(UnexpectedError);
  });

  it("should return an error if comment not found", async () => {
    editCommentResult = await editCommentUseCase.execute(editMockRequestComment);
    expect(editCommentResult.error).toBeDefined();
    expect(mockedHandleModeration).not.toHaveBeenCalled();
    expect(editCommentRepository.update).not.toHaveBeenCalled();
  });

  it("should not update a unchanged comment (same hash)", async () => {
    delete editMockRequestComment.id;
    const previousHash = "767e478708d7ffe20e88fc3e07f7a311";
    const thisMockComment = Comment.create(fakeCommentProperties(editMockRequestComment)).getValue;
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(thisMockComment));
    const editCommentUseCase = new EditComment(editCommentRepository, mockInappropriateModeration, mockSpamModeration);
    const resultEditComment = await editCommentUseCase.execute(editMockRequestComment);
    const editCommentDTO = resultEditComment.getValue as EditCommentDTO;
    expect(editCommentDTO.hash).toEqual(previousHash);
    expect(mockedHandleModeration).not.toHaveBeenCalled();
    expect(editCommentRepository.update).not.toHaveBeenCalled();
  });

  it("should modified a comment", async () => {
    delete editMockRequestComment.id;
    const thisMockComment = Comment.create(fakeCommentProperties(editMockRequestComment)).getValue;
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(thisMockComment));
    const fakePreviousLastModified = new Date("2020-07-07T05:13:03.375Z");
    const fakePreviousHash = "767e478708d7ffe20e88fc3e07f7a311";
    const fakePreviousTest = "Sic Mundus Creatus Est.";
    editMockRequestComment.text = "Tic tac, tic tac.";
    const editCommentUseCase = new EditComment(editCommentRepository, mockInappropriateModeration, mockSpamModeration);
    const resultEditComment = await editCommentUseCase.execute(editMockRequestComment);
    const editCommentDTO = resultEditComment.getValue as EditCommentDTO;
    expect(editCommentDTO.text).not.toEqual(fakePreviousTest);
    expect(editCommentDTO.lastModifiedAt).not.toEqual(fakePreviousLastModified);
    expect(editCommentDTO.hash).not.toEqual(fakePreviousHash);
    expect(editCommentRepository.update).toHaveBeenCalled();
  });

  it("should publish safe comments", async () => {
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(fakeComment));
    const editCommentUseCase = new EditComment(editCommentRepository, mockInappropriateModeration, mockSpamModeration);
    const resultEditComment = await editCommentUseCase.execute(editMockRequestComment);
    const editCommentDTO = resultEditComment.getValue as EditCommentDTO;
    expect(editCommentDTO.published).toBeTruthy();
    expect(mockedHandleModeration).toHaveBeenCalledTimes(1);
  });

  it("should not publish questionable comments", async () => {
    editCommentRepository.findById = jest.fn(async () => Promise.resolve(fakeComment));
    mockIsQuestionable = jest.fn(async () => Promise.resolve(true));
    const editCommentUseCase = new EditComment(editCommentRepository, mockInappropriateModeration, mockSpamModeration);
    const resultEditComment = await editCommentUseCase.execute(editMockRequestComment);
    const editCommentDTO = resultEditComment.getValue as EditCommentDTO;
    expect(editCommentDTO.published).toBeFalsy();
    expect(mockedHandleModeration).toHaveBeenCalledTimes(1);
  });
});
