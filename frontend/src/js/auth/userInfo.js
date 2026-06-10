import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class UserInfo {
  static async balance() {
    this.balanceUser = document.getElementById("balanceUser");

    const result = await HttpUtils.request("/balance");
    if (result.redirect) {
      return this.openNewRoute("/login");
    }
    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert("Ошибка при запросе данных");
    }
    this.balanceUser.innerText = `${result.response.balance}$`;
  }

  static async userName() {
    const nameUser = document.getElementById("nameUser");
    const userString = await AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
    const user = JSON.parse(userString);
    nameUser.innerText = `${user.name} ${user.lastName}`;
  }

}
