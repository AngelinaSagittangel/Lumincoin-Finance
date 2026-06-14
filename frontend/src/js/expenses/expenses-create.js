import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UpdateBalance } from "../auth/update-balance.js";
import { UserInfo } from "../auth/userInfo.js";

export class ExpensesCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.createCategoryInput = document.getElementById("new-category-input");
    document
      .querySelector(".save-new-category")
      .addEventListener("click", this.saveExpenses.bind(this));
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

  async saveExpenses(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const result = await HttpUtils.request(
        "/categories/expense",
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
      return this.openNewRoute("/expenses");
    }
  }
}
