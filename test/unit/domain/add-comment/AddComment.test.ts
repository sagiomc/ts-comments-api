// Mock classes first
let mockIsQuestionable = jest.fn(async () => Promise.resolve(false));
jest.mock("../../../../src/domain/handle-moderation/HandleModeration", () => {
  return {
    HandleModeration: jest.fn().mockImplementation(() => {
      return {isQuestionable: mockIsQuestionable};
    })
  };
});

// Import classes
import { AddComment, AddCommentDTO } from "../../../../src/domain/add-comment";
import { HandleModeration } from "../../../../src/domain/handle-moderation/HandleModeration";
import { UnexpectedError } from "../../../../src/shared/domain";
import { mocked } from "ts-jest/utils";

// Unit test logic
describe("Add comment ", () => {
  const mockedHandleModeration = mocked(HandleModeration, true);
  const mockComment = {
    author: "Judd Kunze",
    postId: "bdd30e5f-3965-4702-8350-8962ba27b70c",
    text: "Dolorem accusantium corporis inventore nobis nihil sunt minus corrupti cum.",
    ip: "162.6.121.153"
  };

  let mockAddCommentRepository;
  let mockInappropriateModeration;
  let mockSpamModeration;

  beforeEach(() => {
    mockedHandleModeration.mockClear();
    mockIsQuestionable.mockClear();
    mockInappropriateModeration = {
      isInappropriate: jest.fn()
    };
    mockSpamModeration = {
      isSpam: jest.fn()
    };
    mockAddCommentRepository = {
      findByHash: jest.fn(async () => Promise.resolve(null)),
      save: jest.fn(async () => Promise.resolve())
    };
  });

  it("should return an error if the comment is invalid", async () => {
    const invalidSource = {...mockComment, ip: null};
    const invalidComment = {...mockComment, author: null };
    const addCommentUseCase = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const addCommentSource = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addCommentUseCase.execute(invalidComment);
    const commentSourceResponse = await addCommentSource.execute(invalidSource);
    expect(commentSourceResponse.error).toBeDefined();
    expect(commentResponse.error).toBeDefined();
  });

  it("should return an UnexpectedError if the promise fails in execute()", async () => {
    mockAddCommentRepository.findByHash = jest.fn(async () => Promise.reject());
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addComment.execute(mockComment);
    expect(commentResponse).toBeInstanceOf(UnexpectedError);
  });

  it("should not save a comment with the same hash", async () => {
    // Expected hash for mockComment: 73f855fc787481dc53f457c86de0791c
    const commentFromFakeDatabase = {
      id: "5743fcdb-49e2-416b-a92f-e55372e3389a",
      hash: "73f855fc787481dc53f457c86de0791c",
      published: true
    };
    mockAddCommentRepository.findByHash = jest.fn(async () => Promise.resolve(commentFromFakeDatabase));
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addComment.execute(mockComment);
    const commentDTO = commentResponse.getValue as AddCommentDTO;
    expect(mockAddCommentRepository.findByHash).toHaveBeenCalledTimes(1);
    expect(commentDTO).toStrictEqual(commentFromFakeDatabase);
    expect(mockedHandleModeration).toHaveBeenCalledTimes(0);
    expect(mockAddCommentRepository.save).toHaveBeenCalledTimes(0);
  });

  it("should publish safe comments", async () => {
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addComment.execute(mockComment);
    const commentDTO = commentResponse.getValue as AddCommentDTO;
    expect(commentDTO.published).toBeTruthy();
  });

  it("should not publish questionable comments", async () => {
    mockIsQuestionable = jest.fn(async () => Promise.resolve(true));
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addComment.execute(mockComment);
    const commentDTO = commentResponse.getValue as AddCommentDTO;
    expect(commentDTO.published).toBeFalsy();
  });

  it("should save a valid comments", async () => {
    mockIsQuestionable = jest.fn(async () => Promise.resolve(false));
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const commentResponse = await addComment.execute(mockComment);
    expect(commentResponse.getValue).toBeDefined();
    expect(mockAddCommentRepository.save).toHaveBeenCalledTimes(1);
  });

  it("should save a replies comments", async () => {
    mockIsQuestionable = jest.fn(async () => Promise.resolve(false));
    const addComment = new AddComment(
      mockAddCommentRepository,
      mockInappropriateModeration,
      mockSpamModeration
    );
    const replyToComment = {...mockComment, replyToId: "f997bb76-82b4-45cb-afe7-a2bc9410eb5e" };
    const commentResponse = await addComment.execute(replyToComment);
    const comment = commentResponse.getValue as AddCommentDTO;
    expect(comment.replyToId).toBeDefined();
    expect(mockAddCommentRepository.save).toHaveBeenCalledTimes(1);
  });
});
