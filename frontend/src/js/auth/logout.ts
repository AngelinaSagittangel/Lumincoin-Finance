import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class Logout {
  private openNewRoute: (path: string) => void;
  constructor(openNewRoute: (path: string) => void) {
    this.openNewRoute = openNewRoute;

    if (
      !AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ||
      !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
    ) {
      this.openNewRoute("/login");
      return;
    }

    this.logout().then();
  }

  public async logout(): Promise<void> {
    const result = await HttpUtils.request("/logout", "POST", false, {
      refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
    });

    AuthUtils.removeAuthInfo();

    this.openNewRoute("/login");
  }
}
