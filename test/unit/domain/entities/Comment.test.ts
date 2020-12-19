import { Comment, CommentProps } from "../../../../src/domain/entities";
import { UniqueEntityID } from "../../../../src/shared/domain";
import { fakeCommentProperties } from "../../../fixtures/CommentFixture";


describe("Comment", () => {

  const defaultCommentProperties: CommentProps = fakeCommentProperties();
  const defaultCommentResult = Comment.create(defaultCommentProperties);
  const defaultComment = defaultCommentResult.getValue;

  it("must have a valid author.", () => {
    const commentPropertiesWithNullAuthor: CommentProps = fakeCommentProperties({author: null});
    const commentResultNullAuthor = Comment.create(commentPropertiesWithNullAuthor);
    const commentPropertiesWithInvalidAuthor: CommentProps = fakeCommentProperties({author: "Le"});
    const commentResultInvalidAuthor = Comment.create(commentPropertiesWithInvalidAuthor);
    expect(commentResultNullAuthor.isSuccess).toBe(false);
    expect(commentResultInvalidAuthor.isSuccess).toBe(false);
  });

  it("must have a valid id.", () => {
    const commentPropertiesWithIdNull: CommentProps = fakeCommentProperties({id: null});
    const commentPropertiesWithInvalidId: CommentProps = fakeCommentProperties({id: new UniqueEntityID("Invalid")});
    const commentResultNullId = Comment.create(commentPropertiesWithIdNull);
    const commentResultInvalidId = Comment.create(commentPropertiesWithInvalidId);
    expect(commentResultNullId.isSuccess).toBe(false);
    expect(commentResultInvalidId.isSuccess).toBe(false);
  });

  it("must contain a postId.", () => {
    const commentProperties: CommentProps = fakeCommentProperties({postId: null});
    const commentResult = Comment.create(commentProperties);
    expect(commentResult.isSuccess).toBe(false);
  });

  it("must contain text.", () => {
    const commentProperties: CommentProps = fakeCommentProperties({text: null});
    const commentResult = Comment.create(commentProperties);
    expect(commentResult.isSuccess).toBe(false);
  });

  it("must have a source.", () => {
    const commentProperties: CommentProps = fakeCommentProperties({source: null});
    const commentResult = Comment.create(commentProperties);
    expect(commentResult.isSuccess).toBe(false);
  });

  it("if reply to another comment the id must be valid", () => {
    const commentPropertiesInvalidReplyId: CommentProps = fakeCommentProperties({replyToId: new UniqueEntityID("Invalid")});
    const commentResultInvalidReplyId = Comment.create(commentPropertiesInvalidReplyId);
    expect(commentResultInvalidReplyId.isSuccess).toBe(false);
  });

  it("can be reply in another comment", () => {
    const auditableData = {createdBy: "Existing Author", createdAt: new Date(), lastModifiedAt: new Date()};
    const replyId = new UniqueEntityID("17767bf8-10da-4d9b-8b0a-628e4551af82");
    const commentPropertiesReplyId = fakeCommentProperties({replyToId: replyId});
    commentPropertiesReplyId.auditableData = auditableData;
    const commentReply = Comment.create(commentPropertiesReplyId).getValue;
    expect(commentReply.getReplyToId).toStrictEqual(new UniqueEntityID("17767bf8-10da-4d9b-8b0a-628e4551af82"));
    expect(commentReply.getPostId).toBeDefined();
  });

  it("can be marked deleted", () => {
    defaultComment.markDeleted();
    expect(defaultComment.getText).toEqual(".xX This comment has been deleted Xx.");
    expect(defaultComment.getAuthor).toEqual("Deleted");
    expect(defaultComment.getIsDeleted).toBe(true);
  });

  it("can be published", () => {
    defaultComment.publish();
    expect(defaultComment.getIsPublished).toBe(true);
  });

  it("can be unpublished", () => {
    defaultComment.unPublish();
    expect(defaultComment.getIsPublished).toBe(false);
  });

  it("should include a hash", function () {
    const commentProperties = fakeCommentProperties({
      author: "Bruce Wayne",
      text: "I'm batman.",
      postId: "cjt65art5350vy000hm1rp3s9",
      source: {ip: "127.0.0.1"}
    });
    const commentResult = Comment.create(commentProperties);
    const commentHash = commentResult.getValue;
    // md5 from: http://www.miraclesalad.com/webtools/md5.php
    expect(commentHash.getHash).toBe("7bb94f070d9305976b5381b7d3e8ad8a");
  });

});
