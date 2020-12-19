import axios from "axios";
import querystring from "querystring";

export type HttpConfig = {
  data: {} | string;
  url: string;
  headers?: {};
  params?: {};
};

export class HttpClientHelper {
  public static async post(config: HttpConfig, isQueryString = false): Promise<unknown> {
    let data;
    if (isQueryString) {
      data = config.data as object;
      data = querystring.stringify(data);
    } else {
      data = config.data as string;
    }
    config.data = data;

    return axios({ ...config, method: "post" });
  }
}
