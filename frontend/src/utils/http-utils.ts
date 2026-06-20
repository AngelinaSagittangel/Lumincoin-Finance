import config from "../config/config";
import { AuthUtils } from "./auth-utils";

export class HttpUtils {
  public static async request(
    url: string,
    method: string = "GET",
    useAuth: boolean = true,
    body: any = null,
  ): Promise<any> {
    const result: { error: boolean; response: any | null; redirect?: string } =
      {
        error: false,
        response: null,
      };

    const params: any = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };

    if (body) {
      params.body = JSON.stringify(body);
    }

    let token: string | null = null;

    if (useAuth) {
      token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;
      if (token) {
        params.headers["x-auth-token"] = token;
      }
    }

    let response: Response;
    try {
      response = await fetch(config.api + url, params);
      result.response = await response.json();
    } catch (e) {
      result.error = true;
      return;
    }

    if (response.status < 200 || response.status >= 300) {
      result.error = true;
      if (useAuth && response.status === 401) {
        if (!token) {
          result.redirect = "/login";
        } else {
          const updateTokenResult: boolean =
            await AuthUtils.updateRefreshToken();
          if (updateTokenResult) {
            return this.request(url, method, useAuth, body);
          } else {
            result.redirect = "/login";
          }
        }
      }
    }

    return result;
  }
}
