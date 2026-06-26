import { CategoryType } from "../../types/all-finance.type";
import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";



export class Expenses {
  private openNewRoute: (path: string) => Promise<void>;
  private currentCategory: CategoryType | null = null;

  constructor(openNewRoute: (path: string) => Promise<void>) {
    this.openNewRoute = openNewRoute;
    this.currentCategory = null;

    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.getExpenses();
  }

  private async getExpenses(): Promise<void> {
    const result = await HttpUtils.request<CategoryType[]>("/categories/expense");
    if (result.redirect) {
      return this.openNewRoute("/login");
    }
    if (
      result.error ||
      !result.response ||
      (result.response && result.response.length < 0)
    ) {
      return alert("Ошибка при запросе данных");
    }
    this.showExpenses(result.response);
    this.initModalCloseHandlers();
  }

  private showExpenses(finance: CategoryType[]): void {
    const financeWrapper: HTMLElement | null =
      document.querySelector(".finance-wrapper");
    const addCard: HTMLElement | null =
      document.querySelector(".card-add-wrapper");
    if (!financeWrapper) {
      return;
    }
    financeWrapper.innerHTML = "";
    finance.forEach((category) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.classList.add("col-xl-4", "col-lg-6", "mb-4");
      const card = document.createElement("div");
      card.classList.add("card", "h-100");
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      const cardTitle = document.createElement("h3");
      cardTitle.classList.add("card-title", "card-title-item", "mb-2");
      cardTitle.innerText = category.title;
      const cardUpdateBtn = document.createElement("a");
      cardUpdateBtn.classList.add("btn", "btn-primary", "mb-2", "me-1");
      cardUpdateBtn.href = "/expenses-update";
      cardUpdateBtn.textContent = "Редактировать";
      const cardDeleteBtn = document.createElement("a");
      cardDeleteBtn.classList.add(
        "btn",
        "btn-danger",
        "delete-category",
        "mb-2",
      );
      cardDeleteBtn.href = "#";
      cardDeleteBtn.textContent = "Удалить";
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardUpdateBtn);
      cardBody.appendChild(cardDeleteBtn);
      card.appendChild(cardBody);
      cardWrapper.appendChild(card);
      financeWrapper.appendChild(cardWrapper);

     
      cardUpdateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/expenses-update?id=" + category.id);
      });

      cardDeleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal(category);
      });
    });
    if (addCard) {
      financeWrapper.append(addCard);
    }
  }

  private openModal(category: CategoryType): void {
    this.currentCategory = category;
    const formModal: HTMLElement | null =
      document.querySelector(".modal-finance");
    if (!formModal) {
      return;
    }
    formModal.classList.add("show");
    formModal.style.display = "block";
  }

  private closeModal(): void {
    const formModal: HTMLElement | null =
      document.querySelector(".modal-finance");
    if (!formModal) return;

    formModal.classList.remove("show");
    formModal.style.display = "none";
  }

  private initModalCloseHandlers(): void {
    const footerButtons = document.querySelectorAll(".close-delete-modal");
    const footerButtonsSuccess = document.querySelectorAll(
      ".success-delete-button",
    );
    const that = this;
    footerButtonsSuccess.forEach((button) => {
      button.addEventListener("click", () => {
        if (that.currentCategory) {
          that.deleteCategory(that.currentCategory);
        } else {
          that.closeModal();
        }
      });
    });
    footerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.closeModal();
      });
    });
  }

  private async deleteCategory(category: CategoryType): Promise<void> {
    if (!category.id) {
      this.closeModal();
      return;
    }
    
    const result = await HttpUtils.request<CategoryType>(
      "/categories/expense/" + category.id,
      "DELETE",
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
