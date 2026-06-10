import { HttpUtils } from "../../utils/http-utils";

export class UpdateBalance {
  static init() {
    const balanceUser = document.getElementById("balanceUser");
    if (balanceUser) {
      balanceUser.addEventListener("click", (e) => {
        e.preventDefault();
        this.showModal();
      });
    }
    this.initModalCloseHandlers();
  }

  static showModal() {
    const formModal = document.querySelector(".modal-update-balance");
    if (!formModal) {
      console.error(
        "Ошибка: Модальное окно .modal-update-balance не найдено в DOM! Проверьте порядок загрузки скриптов (используйте defer).",
      );
      return;
    }

    formModal.classList.add("show");
    formModal.style.display = "block";
  }

  static closeModal() {
    const formModal = document.querySelector(".modal-update-balance");
    if (!formModal) return;

    formModal.classList.remove("show");
    formModal.style.display = "none";
  }

  static initModalCloseHandlers() {
    const textNewBalance = document.getElementById("textNewBalance");
    const footerButtons = document.getElementById("btnExitBalance");
    const footerButtonsSuccess = document.getElementById("btnSaveBalance");
    if (footerButtonsSuccess) {
      footerButtonsSuccess.addEventListener("click", () =>
        this.updateBalance(textNewBalance),
      );
    }
    if (footerButtons) {
      footerButtons.addEventListener("click", () => this.closeModal());
    }
  }

  static async updateBalance(textNewBalance) {
    const balanceUser = document.getElementById("balanceUser");
    const result = await HttpUtils.request("/balance", "PUT", true, {
      newBalance: textNewBalance.value,
    });
    if (result.redirect) {
      return this.openNewRoute("/login");
    }
    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert("Ошибка при редактировании баланса");
    }
    balanceUser.innerText = `${result.response.balance}$`;
    this.closeModal();
  }
}
