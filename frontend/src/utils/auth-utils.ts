import config from "../config/config";
import { UserInfoType } from "../types/user-info.type";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  error?: string;
}

export class AuthUtils {
  public static accessTokenKey = "accessToken";
  public static refreshTokenKey = "refreshToken";
  public static userInfoKey = "userInfo";

  public static setAuthInfo(
    accessToken: string,
    refreshToken: string,
    userInfo: UserInfoType | null = null,
  ): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (userInfo) {
      localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
    }
  }

  public static setUserInfo(userInfo: UserInfoType | null): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
  }

  public static removeAuthInfo(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userInfoKey);
  }

  public static getAuthInfo(key: string) {
    if (
      key &&
      [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(
        key,
      )
    ) {
      return localStorage.getItem(key);
    } else {
      return {
        [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
        [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
        [this.userInfoKey]: localStorage.getItem(this.userInfoKey),
      };
    }
  }
  public static async updateRefreshToken(): Promise<boolean> {
    let result: boolean = false;
    const refreshToken = this.getAuthInfo(this.refreshTokenKey);

    if (refreshToken) {
      const response: Response = await fetch(config.api + "/refresh", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      if (response && response.status === 200) {
        const tokens = await response.json() as RefreshTokenResponse;
        if (tokens && !tokens.error) {
          this.setAuthInfo(tokens.accessToken, tokens.refreshToken);
          result = true;
        }
      }
    }
    if (!result) {
      this.removeAuthInfo();
    }

    return result;
  }
}
