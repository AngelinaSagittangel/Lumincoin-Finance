import { AllFinanceType, CategoryType } from "../../types/all-finance.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";

export class AllFinanceUpdate {
  private openNewRoute: (path: string) => Promise<void>;

  private id: string | null = null;
  private typeInput: HTMLSelectElement | null = null;
  private categoryInput: HTMLSelectElement | null = null;
  private amountInput: HTMLInputElement | null = null;
  private dateInput: HTMLInputElement | null = null;
  private commentInput: HTMLInputElement | null = null;
  private saveBtn: HTMLElement | null = null;

  private currentType: string = "";

  constructor(openNewRoute: (path: string) => Promise<void>) {
    this.openNewRoute = openNewRoute;

    const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
    if (!token) {
      this.openNewRoute("/login");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get("id");
    if (!this.id) {
      this.openNewRoute("/finance");
      return;
    }
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
      "datepicker",
    ) as HTMLInputElement | null;
    this.commentInput = document.getElementById(
      "commentInput",
    ) as HTMLInputElement | null;

    if (this.typeInput) {
      this.typeInput.addEventListener("change", this.getType.bind(this));
    }

    this.saveBtn = document.querySelector(".saveBtn") as HTMLElement | null;
    if (this.saveBtn) {
      this.saveBtn.addEventListener("click", this.saveCategory.bind(this));
    }

    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.getInfo();
  }

  private getType(): void {
    if (!this.typeInput) return;
    if (this.typeInput.value === "Доход") {
      this.currentType = "income";
    } else if (this.typeInput.value === "Расход") {
      this.currentType = "expense";
    }
    this.getCategory();
  }

  private async getInfo(): Promise<void> {
    const result = await HttpUtils.request<AllFinanceType>(
      "/operations/" + this.id,
    );
    if (result.redirect) {
      return this.openNewRoute("/login");
    }
    if (
      result.error ||
      !result.response 
    ) {
      return alert("Ошибка при запросе данных");
    }
    this.showInfoInput(result.response);
  }

  private async getCategory(): Promise<void> {
    if (!this.currentType || !this.typeInput) return;
    if (this.currentType === "income" || this.typeInput.value === "Доход") {
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
        return alert("Ошибка при запросе данных");
      }
      this.showCategory(result.response);
    } else if (
      this.currentType === "expense" ||
      this.typeInput.value === "Расход"
    ) {
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
        return alert("Ошибка при запросе данных");
      }
      this.showCategory(result.response);
    }
  }

  private showCategory(result: CategoryType[]): void {
    if (!this.categoryInput) return;
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

  private showInfoInput(result: AllFinanceType): void {
    if (this.typeInput) {
      if (result.type === "expense") {
        this.typeInput.value = "Расход";
      } else if (result.type === "income") {
        this.typeInput.value = "Доход";
      }
    }

    if (this.amountInput) {
      this.amountInput.value = String(result.amount);
    }

    if (this.dateInput) {
      this.dateInput.value = result.date;
    }

    if (this.commentInput && result.comment) {
      this.commentInput.value = result.comment;
    }

    if (this.typeInput) {
      this.getType();
    }
  }

  private validateForm(): boolean {
    if (
      !this.typeInput ||
      !this.categoryInput ||
      !this.amountInput ||
      !this.dateInput
    )
      return false;
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

    if (!this.id) {
      return;
    }
    if (this.validateForm()) {
      if (
        !this.currentType ||
        !this.amountInput ||
        !this.dateInput ||
        !this.commentInput ||
        !this.categoryInput
      )
        return;
      const result = await HttpUtils.request<AllFinanceType[]>(
        "/operations/" + this.id,
        "PUT",
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
