import { Comment } from "../../../../src/domain/entities";
import { HandleModeration } from "../../../../src/domain/handle-moderation/HandleModeration";
import { fakeCommentProperties } from "../../../fixtures/CommentFixture";

describe("Handle moderation ", () => {
  let inappropriateModeration;
  let spamModeration;

  beforeEach(() => {
    inappropriateModeration = {
      isInappropriate: jest.fn(async () => Promise.resolve(false))
    };
    spamModeration = {
      isSpam: jest.fn(async () => Promise.resolve(false))
    };
  });

  it("should not moderate a safe comment ", async () => {
    const fakeComment = Comment.create(fakeCommentProperties({text: "What a lovely post"})).getValue;
    const handleModeration = new HandleModeration(inappropriateModeration, spamModeration);
    const isQuestionable = await handleModeration.isQuestionable(fakeComment);
    expect(isQuestionable).toBeFalsy();
  });

  it("should moderate a questionable comment ", async () => {
    const fakeComment = Comment.create(fakeCommentProperties({text: "What is this #!@*"})).getValue;
    inappropriateModeration.isInappropriate = jest.fn(async () => Promise.resolve(true));
    const handleModeration = new HandleModeration(inappropriateModeration, spamModeration);
    const isQuestionable = await handleModeration.isQuestionable(fakeComment);
    expect(isQuestionable).toBeTruthy();
  });


  it("should not moderate a comment if there is an error in SpamModeration", async () => {
    const fakeComment = Comment.create(fakeCommentProperties()).getValue;
    spamModeration.isSpam = jest.fn(async () => Promise.reject());
    const handleModeration = new HandleModeration(inappropriateModeration, spamModeration);
    const isQuestionable = await handleModeration.isQuestionable(fakeComment);
    expect(isQuestionable).toBeFalsy();
  });

  it("should not moderate a comment if there is an error in InappropriateModeration", async () => {
    const fakeComment = Comment.create(fakeCommentProperties()).getValue;
    inappropriateModeration.isInappropriate = jest.fn(async () => Promise.reject());
    const handleModeration = new HandleModeration(inappropriateModeration, spamModeration);
    const isQuestionable = await handleModeration.isQuestionable(fakeComment);
    expect(isQuestionable).toBeFalsy();
  });
});
