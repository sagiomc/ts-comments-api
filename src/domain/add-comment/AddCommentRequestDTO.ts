export type AddCommentRequestDTO = {
  author: string;
  postId: string;
  text: string;
  ip: string;
  replyToId?: string;
  browser?: string;
  referrer?: string;
};
