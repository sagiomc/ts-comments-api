import { SpamStrategy, SpamStrategyDTO } from "./SpamStrategy";
import { Comment } from "../entities";
import { InappropriateStrategy } from "./InappropriateStrategy";

export class HandleModeration {
  private readonly inappropriateStrategy: InappropriateStrategy;
  private readonly spamStrategy: SpamStrategy;

  public constructor(inappropriateStrategy: InappropriateStrategy, spamStrategy: SpamStrategy) {
    this.inappropriateStrategy = inappropriateStrategy;
    this.spamStrategy = spamStrategy;
  }

  public async isQuestionable(comment: Comment): Promise<boolean> {
    const isInappropriate = await this.moderateInappropriate(comment.getText);
    const isSpam = await this.moderateSpam(comment);

    return isInappropriate || isSpam;
  }

  private async moderateInappropriate(text: string): Promise<boolean> {
    try {
      return await this.inappropriateStrategy.isInappropriate(text);
    } catch (e) {
      return false;
    }
  }

  private async moderateSpam(comment: Comment): Promise<boolean> {
    const commentSpamDTO: SpamStrategyDTO = {
      text: comment.getText,
      author: comment.getAuthor,
      createdAt: comment.getCreatedAt,
      lastModifiedAt: comment.setLastModifiedAt,
      ip: comment.getSource.getIp,
      browser: comment.getSource.getBrowser,
      referrer: comment.getSource.getReferrer
    };
    try {
      return await this.spamStrategy.isSpam(commentSpamDTO);
    } catch (e) {
      return false;
    }
  }
}
