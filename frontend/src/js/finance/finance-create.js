import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UserInfo } from "../auth/userInfo.js";

export class FinanceCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();
    UserInfo.balance();
    UserInfo.userName();
    this.createCategoryInput = document.getElementById("new-category-input");
    document
      .querySelector(".save-new-category")
      .addEventListener("click", this.saveFinance.bind(this));
  }

  validateForm() {
    let isValid = true;

    if (this.createCategoryInput.value) {
      this.createCategoryInput.classList.remove("is-invalid");
    } else {
      this.createCategoryInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  async saveFinance(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const result = await HttpUtils.request(
        "/categories/income",
        "POST",
        true,
        {
          title: this.createCategoryInput.value,
        },
      );
      if (result.redirect) {
        return this.openNewRoute("/login");
      }
      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Такое название уже используется, либо ошибка при запросе данных",
        );
      }
      return this.openNewRoute("/finance");
    }
  }
}
