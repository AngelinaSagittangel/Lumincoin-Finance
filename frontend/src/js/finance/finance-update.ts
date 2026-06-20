import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";



export class FinanceUpdate {
  private openNewRoute: (path: string) => Promise<void>;
  private updateCategoryInput: HTMLInputElement | null = null;
  private id: string | null = null;

  constructor(openNewRoute: (path: string) => Promise<void>) {
    this.openNewRoute = openNewRoute;

    const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
    if (!token) {
      this.openNewRoute("/login");
      return;
    }
    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.updateCategoryInput = document.getElementById(
      "update-category-input",
    ) as HTMLInputElement | null;
    if (!this.updateCategoryInput) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get("id");
    if (!this.id) {
      this.openNewRoute("/finance");
      return;
    }

    this.showNameInput();
    const updateButton = document.querySelector(
      ".update-new-category",
    ) as HTMLElement | null;
    if (!updateButton) {
      return;
    }

    updateButton.addEventListener("click", this.updateCategory.bind(this));
  }

  private async showNameInput(): Promise<void> {
    if (!this.id || !this.updateCategoryInput) {
      this.openNewRoute("/finance");
      return;
    }
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

  private validateForm(): boolean {
    if (!this.updateCategoryInput) return false;
    let isValid = true;

    if (this.updateCategoryInput.value) {
      this.updateCategoryInput.classList.remove("is-invalid");
    } else {
      this.updateCategoryInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  private async updateCategory(): Promise<void> {
    if (!this.id || !this.updateCategoryInput) {
      alert(
        "Произошла непредвиденная ошибка. Обновите страницу и попробуйте снова.",
      );
      return;
    }
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
