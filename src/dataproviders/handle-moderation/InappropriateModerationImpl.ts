import { HttpClientHelper } from "../Helpers/HttpClientHelper";
import { InappropriateStrategy } from "../../domain/handle-moderation/InappropriateStrategy";

export type InappropriateApiResponse = {
  OriginalText: string;
  Classification?: {
    ReviewRecommended: boolean;
  };
};

export class InappropriateModerationImpl implements InappropriateStrategy{
  public async isInappropriate(text: string): Promise<boolean> {
    let response;
    const httpConfig = {
      data: text,
      params: {classify: "true"},
      headers: {
        "Content-Type": "text/html",
        "Ocp-Apim-Subscription-Key": process.env.MODERATOR_API_KEY
      },
      url: process.env.MODERATOR_API_URL
    };

    response = await HttpClientHelper.post(httpConfig);
    response = response.data as InappropriateApiResponse;

    if (response.Classification) {
      return response.Classification.ReviewRecommended;
    }

    return false;
  }
}
