import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UpdateBalance } from "../auth/update-balance.js";
import { UserInfo } from "../auth/userInfo.js";

export class AllFinanceUpdate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    const urlParams = new URLSearchParams(window.location.search);
    this.id = urlParams.get("id");
    if (!this.id) {
      return this.openNewRoute("/finance");
    }
    this.typeInput = document.getElementById("typeInput");
    this.categoryInput = document.getElementById("categoryInput");
    this.amountInput = document.getElementById("amountInput");
    this.dateInput = document.getElementById("datepicker");
    this.commentInput = document.getElementById("commentInput");
    this.currentType = "";
    this.typeInput.addEventListener("change", this.getType.bind(this));

    this.saveBtn = document.querySelector(".saveBtn");
    this.saveBtn.addEventListener("click", this.saveCategory.bind(this));
    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.getInfo();
  }

  getType() {
    if (this.typeInput.value === "Доход") {
      this.currentType = "income";
    } else if (this.typeInput.value === "Расход") {
      this.currentType = "expense";
    }
    this.getCategory();
  }

  async getInfo() {
    const result = await HttpUtils.request("/operations/" + this.id);
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
    this.showInfoInput(result.response);
    return result.response;
  }

  async getCategory() {
    if (this.currentType === "income" || this.typeInput.value === "Доход") {
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
    } else if (
      this.currentType === "expense" ||
      this.typeInput.value === "Расход"
    ) {
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

  showInfoInput(result) {
    if (result.type === "expense") {
      this.typeInput.value = "Расход";
    } else if (result.type === "income") {
      this.typeInput.value = "Доход";
    }
    console.log(result.category);
    this.amountInput.value = result.amount;
    this.dateInput.value = result.date;
    this.commentInput.value = result.comment;
    this.getType();
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
      const result = await HttpUtils.request(
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
