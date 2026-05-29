import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UserInfo } from "../auth/userInfo.js";

export class Finance {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.currentCategory = null;

    ModalLogout.init();
    UserInfo.balance();
    UserInfo.userName();
    this.getFinance();
  }

  async getFinance() {
    const result = await HttpUtils.request("/categories/income");
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
    this.showFinance(result.response);
    this.initModalCloseHandlers();
  }

  showFinance(finance) {
    const financeWrapper = document.querySelector(".finance-wrapper");
    const addCard = document.querySelector(".card-add-wrapper");
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
      cardUpdateBtn.href = "/finance-update";
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

      if (addCard) {
        financeWrapper.append(addCard);
      }

      cardUpdateBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/finance-update?id=" + category.id);
      });

      cardDeleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal(category);
      });
    });
  }

  openModal(category) {
    this.category = category;
    const formModal = document.querySelector(".modal-finance");

    formModal.classList.add("show");
    formModal.style.display = "block";
  }

  closeModal() {
    const formModal = document.querySelector(".modal-finance");
    if (!formModal) return;

    formModal.classList.remove("show");
    formModal.style.display = "none";
  }

  initModalCloseHandlers() {
    const footerButtons = document.querySelectorAll(".close-delete-modal");
    const footerButtonsSuccess = document.querySelectorAll(
      ".success-delete-button",
    );
    footerButtonsSuccess.forEach((button) => {
      button.addEventListener("click", () => {
        this.deleteCategory(this.category);
      });
    });
    footerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.closeModal();
      });
    });
  }

  async deleteCategory(category) {
    const id = category.id;
    const result = await HttpUtils.request(
      "/categories/income/" + id,
      "DELETE",
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
