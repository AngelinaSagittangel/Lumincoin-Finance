import { AuthUtils } from "../../utils/auth-utils.js";

export class AllFinanceUpdate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
  }
}
