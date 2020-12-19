import * as mockListComments from "./MockListComments.json";
import { ListCommentDTO, ListComments } from "../../../../src/domain/list-comments";
import { UnexpectedError } from "../../../../src/shared/domain";

const receiveMockListComments: Array<ListCommentDTO> = mockListComments["receivedMockListComments"];
const expectedMockListComments: Array<ListCommentDTO> = mockListComments["expectedMockListComments"];

describe("List comments ", () => {
  const validPostId = {postId: "postId123456"};
  let mockListRepository;
  beforeEach(() => {
    mockListRepository = {
      findByPostId: jest.fn(async () => Promise.resolve([]))
    };
  });

  it("should return an error if postId is invalid", async () => {
    const listCommentsUseCase = new ListComments(mockListRepository);
    const listComments = await listCommentsUseCase.execute({ postId: null });
    expect(listComments.error).toBeDefined();
  });

  it("should return an UnexpectedError if the promise fails in execute()", async () => {
    mockListRepository.findByPostId = jest.fn(async () => Promise.reject());
    const listCommentsUseCase = new ListComments(mockListRepository);
    const listCommentResponse = await listCommentsUseCase.execute(validPostId);
    expect(listCommentResponse).toBeInstanceOf(UnexpectedError);
  });

  it("should return an empty array if no matches found for postId", async () => {
    const listCommentsUseCase = new ListComments(mockListRepository);
    const emptyArray = await listCommentsUseCase.execute(validPostId);
    expect(emptyArray.getValue).toEqual([]);
  });

  it("should return all nested comments from postId", async () => {
    mockListRepository.findByPostId = jest.fn(async () => Promise.resolve(receiveMockListComments));
    const listCommentsUseCase = new ListComments(mockListRepository);
    const listComments = await listCommentsUseCase.execute({postId: "5f03d787738713b7cd9afb14"});
    expect(listComments.getValue).toEqual(expectedMockListComments);
  });
});
