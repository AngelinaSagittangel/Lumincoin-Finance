import { AllFinanceType, CategoryType } from "../../types/all-finance.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";

export class AllFinanceCreate {
  private currentType: string | null;
  private financeValueType: HTMLInputElement | null = null;
  private expenseValueType: HTMLInputElement | null = null;
  private typeInput: HTMLSelectElement | null = null;
  private categoryInput: HTMLSelectElement | null = null;
  private amountInput: HTMLInputElement | null = null;
  private dateInput: HTMLInputElement | null = null;
  private commentInput: HTMLInputElement | null = null;
  private saveBtn: HTMLElement | null = null;

  private openNewRoute: (path: string) => Promise<void>;

  constructor(openNewRoute: (path: string) => Promise<void>) {
    this.currentType = null;

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

    const urlParams = new URLSearchParams(window.location.search);
    this.currentType = urlParams.get("type");
    if (!this.currentType) {
      this.openNewRoute("/all-finance");
      return;
    }

    this.financeValueType = document.getElementById(
      "finance-value",
    ) as HTMLInputElement | null;
    this.expenseValueType = document.getElementById(
      "expense-value",
    ) as HTMLInputElement | null;
    this.typeInput = document.getElementById(
      "typeInput",
    ) as HTMLSelectElement | null;
    this.categoryInput = document.getElementById(
      "categoryInput",
    ) as HTMLSelectElement | null;
    this.amountInput = document.getElementById(
      "amountInput",
    ) as HTMLInputElement | null;
    this.dateInput = document.getElementById(
      "datepicker-all-finance",
    ) as HTMLInputElement | null;
    this.commentInput = document.getElementById(
      "commentInput",
    ) as HTMLInputElement | null;
    this.saveBtn = document.querySelector(".saveBtn") as HTMLElement | null;

    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", this.saveCategory.bind(this));
    }

    if (this.typeInput) {
      this.typeInput.addEventListener(
        "change",
        this.changeTypeInput.bind(this),
      );

      if (this.currentType === "income") {
        this.typeInput.value = "Доход";
        this.getCategory();
      } else if (this.currentType === "expense") {
        this.typeInput.value = "Расход";
        this.getCategory();
      }
    }

    if (this.dateInput) {
      this.dateInput.addEventListener("click", this.showDateInput.bind(this));
    }
  }

  private showDateInput(): void {
    if (this.dateInput) {
      this.dateInput.style.opacity = "1";
    }
  }

  private changeTypeInput(): void {
    if (!this.typeInput) return;
    const selecdType = this.typeInput.value;

    if (selecdType === "Доход") {
      this.currentType = "income";
    } else if (selecdType === "Расход") {
      this.currentType = "expense";
    }

    this.getCategory();
  }

  private async getCategory(): Promise<void> {
    if (!this.currentType) return;
    if (this.currentType === "income") {
      const result =
        await HttpUtils.request<CategoryType[]>("/categories/income");
      if (result.redirect) {
        return this.openNewRoute("/login");
      }
      if (
        result.error ||
        !result.response ||
        (result.response && result.response.length === 0)
      ) {
        return console.log("Ошибка при запросе данных");
      }
      this.showCategory(result.response);
    } else if (this.currentType === "expense") {
      const result = await HttpUtils.request<CategoryType[]>(
        "/categories/expense",
      );
      if (result.redirect) {
        return this.openNewRoute("/login");
      }
      if (
        result.error ||
        !result.response ||
        (result.response && result.response.length === 0)
      ) {
        return console.log("Ошибка при запросе данных");
      }
      this.showCategory(result.response);
    }
  }

  private showCategory(result: CategoryType[]): void {
    if (!this.categoryInput) {
      return;
    }
    this.categoryInput.innerHTML = "";
    result.forEach((element) => {
      const option = document.createElement("option");
      option.value = element.id.toString();
      option.textContent = element.title;
      if (this.categoryInput) {
        this.categoryInput.appendChild(option);
      }
    });
  }

  private validateForm(): boolean {
    if (
      !this.typeInput ||
      !this.categoryInput ||
      !this.amountInput ||
      !this.dateInput
    ) {
      return false;
    }

    let isValid = true;

    if (this.typeInput.value) {
      this.typeInput.classList.remove("is-invalid");
    } else {
      this.typeInput.classList.add("is-invalid");
      isValid = false;
    }

    if (this.categoryInput.value) {
      this.categoryInput.classList.remove("is-invalid");
    } else {
      this.categoryInput.classList.add("is-invalid");
      isValid = false;
    }

    if (this.amountInput.value) {
      this.amountInput.classList.remove("is-invalid");
    } else {
      this.amountInput.classList.add("is-invalid");
      isValid = false;
    }

    if (this.dateInput.value) {
      this.dateInput.classList.remove("is-invalid");
    } else {
      this.dateInput.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  private async saveCategory(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.validateForm()) {
      return;
    }
    if (
      !this.amountInput ||
      !this.dateInput ||
      !this.commentInput ||
      !this.categoryInput
    ) {
      return;
    }
    if (this.validateForm()) {
      const result = await HttpUtils.request<AllFinanceType[]>(
        "/operations",
        "POST",
        true,
        {
          type: this.currentType,
          amount: parseInt(this.amountInput.value),
          date: this.dateInput.value,
          comment: this.commentInput.value,
          category_id: parseInt(this.categoryInput.value, 10),
        },
      );
      if (result.redirect) {
        return this.openNewRoute("/login");
      }
      if (
        result.error ||
        !result.response ||
        (result.response && result.response.length === 0)
      ) {
        return alert(
          "Такое название уже используется, либо ошибка при запросе данных",
        );
      }
      return this.openNewRoute("/allfinance");
    }
  }
}
