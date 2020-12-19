import { SpamStrategy, SpamStrategyDTO } from "../../domain/handle-moderation/SpamStrategy";
import { HttpClientHelper } from "../Helpers/HttpClientHelper";

export class SpamModerationImpl implements SpamStrategy {
  public async isSpam(commentParams: SpamStrategyDTO): Promise<boolean> {
    let response;
    const dataToApi = {
      blog: "https://devmastery.com",
      user_ip: commentParams.ip,
      user_agent: commentParams.browser,
      referrer: commentParams.referrer,
      comment_type: "comment",
      comment_author: commentParams.author,
      comment_content: commentParams.text,
      comment_date_gmt: new Date(commentParams.createdAt).toISOString(),
      comment_post_modified_gmt: new Date(commentParams.lastModifiedAt).toISOString(),
      blog_lang: "en",
      is_test: false
    };
    const httpConfig = {
      data: dataToApi,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: process.env.SPAM_API_URL
    };
    response = await HttpClientHelper.post(httpConfig, true);
    response = response.data as boolean;

    return response;
  }
}
