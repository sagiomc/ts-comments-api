export type SpamStrategyDTO = {
  text: string;
  author: string;
  createdAt: Date;
  lastModifiedAt: Date;
  ip: string;
  browser: string;
  referrer: string;
};

export interface SpamStrategy {
  isSpam(commentParams: SpamStrategyDTO): Promise<boolean>;
}
