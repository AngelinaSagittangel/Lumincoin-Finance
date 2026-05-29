import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UserInfo } from "../auth/userInfo.js";

export class AllFinanceCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();
    UserInfo.balance();
    UserInfo.userName();

    $(function () {
      $("#datepicker").datepicker({
        language: "ru",
        format: "yyyy-mm-dd",
      });
    });

    this.typeInput = document.getElementById("typeInput");
    this.categoryInput = document.getElementById("categoryInput");
    this.amountInput = document.getElementById("amountInput");
    this.dateInput = document.getElementById("datepicker");
    this.commentInput = document.getElementById("commentInput");

    this.currentType = "income";

    document
      .querySelector(".saveBtn")
      .addEventListener("click", this.saveCategory.bind(this));

    this.typeInput.addEventListener("change", this.getType.bind(this));
    this.typeInput.addEventListener("change", this.getCategory.bind(this));
  }

  getType() {
    if (this.typeInput.value === "Доход") {
      this.currentType = "income";
    } else if (this.typeInput.value === "Расход") {
      this.currentType = "expense";
    }
  }

  async getCategory() {
    if (this.currentType === "income") {
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
      this.showCategory(result.response);
    } else if (this.currentType === "expense") {
      const result = await HttpUtils.request("/categories/expense");
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
      this.showCategory(result.response);
    }
  }

  showCategory(result) {
    this.categoryInput.innerHTML = "";
    result.forEach((elemnt) => {
      const option = document.createElement("option");
      option.value = elemnt.id;
      option.textContent = elemnt.title;
      this.categoryInput.appendChild(option);
    });
  }

  validateForm() {
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

  async saveCategory(e) {
    e.preventDefault();
    if (this.validateForm()) {
      const result = await HttpUtils.request("/operations", "POST", true, {
        type: this.currentType,
        amount: parseInt(this.amountInput.value),
        date: this.dateInput.value,
        comment: this.commentInput.value,
        category_id: parseInt(this.categoryInput.value, 10),
      });
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
      return this.openNewRoute("/allfinance");
    }
  }
}
