import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UpdateBalance } from "../auth/update-balance.js";
import { UserInfo } from "../auth/userInfo.js";

export class AllFinanceCreate {
  constructor(openNewRoute) {
    this.currentType = null;

    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();
    UserInfo.balance();
    UserInfo.userName();
    UpdateBalance.init();

    const urlParams = new URLSearchParams(window.location.search);
    this.currentType = urlParams.get("type");
    if (!this.currentType) {
      return this.openNewRoute("/all-finance");
    }

    $(function () {
      $("#datepicker").datepicker({
        language: "ru",
        format: "yyyy-mm-dd",
      });
    });

    let valueInput = null;

    this.financeValueType = document.getElementById("finance-value");
    this.expenseValueType = document.getElementById("expense-value");

    this.typeInput = document.getElementById("typeInput");
    this.categoryInput = document.getElementById("categoryInput");
    this.amountInput = document.getElementById("amountInput");
    this.dateInput = document.getElementById("datepicker");
    this.commentInput = document.getElementById("commentInput");

    this.saveBtn = document.querySelector(".saveBtn");

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
  }

  changeTypeInput() {
    const selecdType = this.typeInput.value;

    if (selecdType === "Доход") {
      this.currentType = "income";
    } else if (selecdType === "Расход") {
      this.currentType = "expense";
    }

    this.getCategory();
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
