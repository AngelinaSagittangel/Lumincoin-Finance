import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UpdateBalance } from "../auth/update-balance.js";
import { UserInfo } from "../auth/userInfo.js";

export class FinanceUpdate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.updateCategoryInput = document.getElementById("update-category-input");
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get("id");
    if (!this.id) {
      return this.openNewRoute("/finance");
    }

    this.showNameInput();
    document
      .querySelector(".update-new-category")
      .addEventListener("click", this.updateCategory.bind(this));
  }

  async showNameInput() {
    const result = await HttpUtils.request("/categories/income/" + this.id);
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
    this.updateCategoryInput.value = result.response.title;
  }

  validateForm() {
    let isValid = true;

    if (this.updateCategoryInput.value) {
      this.updateCategoryInput.classList.remove("is-invalid");
    } else {
      this.updateCategoryInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  async updateCategory() {
    if (this.validateForm()) {
      const result = await HttpUtils.request(
        "/categories/income/" + this.id,
        "PUT",
        true,
        {
          title: this.updateCategoryInput.value,
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
        return alert("Ошибка при запросе данных");
      }
      return this.openNewRoute("/finance");
    }
  }
}
