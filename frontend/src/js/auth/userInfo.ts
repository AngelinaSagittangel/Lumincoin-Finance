import { BalanceResponseType } from "../../types/balace-response.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class UserInfo {
  static async balance(
    openNewRoute: (path: string) => Promise<void>,
  ): Promise<void> {
    const result: BalanceResponseType = await HttpUtils.request("/balance");
    if (result.error) {
      openNewRoute("/login");
      return;
    } else if (result.response) {
      const balanceUser: HTMLElement | null =
        document.getElementById("balanceUser");
      if (balanceUser) {
        balanceUser.innerText = `${result.response.balance.toString()}$`;
      }
    }
  }

  static async userName(): Promise<void> {
    const nameUser: HTMLElement | null = document.getElementById("nameUser");
    const userString = await AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
    if (typeof userString === "string") {
      const user = JSON.parse(userString);
      if (
        typeof user === "object" &&
        user !== null &&
        "name" in user &&
        "lastName" in user
      ) {
        if (nameUser) {
          nameUser.innerText = `${user.name} ${user.lastName}`;
        }
      }
    }
  }
}
