import { CategoryType } from "../../types/all-finance.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";

export class ExpensesCreate {
  private openNewRoute: (path: string) => Promise<void>;
  private createCategoryInput: HTMLInputElement | null = null;

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
    this.createCategoryInput = document.getElementById(
      "new-category-input",
    ) as HTMLInputElement | null;
    if (!this.createCategoryInput) {
      return;
    }
    const saveButton = document.querySelector(
      ".save-new-category",
    ) as HTMLElement | null;
    if (!saveButton) {
      return;
    }

    saveButton.addEventListener("click", this.saveExpenses.bind(this));
  }
  private validateForm(): boolean {
    if (!this.createCategoryInput) return false;
    let isValid = true;

    if (this.createCategoryInput.value) {
      this.createCategoryInput.classList.remove("is-invalid");
    } else {
      this.createCategoryInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  private async saveExpenses(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    if (!this.createCategoryInput) return;
    if (this.validateForm()) {
      const result = await HttpUtils.request<CategoryType>(
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
        !result.response
      ) {
        return alert(
          "Такое название уже используется, либо ошибка при запросе данных",
        );
      }
      return this.openNewRoute("/expenses");
    }
  }
}
