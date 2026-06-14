import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";
import { ModalLogout } from "../auth/modal-logout.js";
import { UpdateBalance } from "../auth/update-balance.js";
import { UserInfo, userInfo } from "../auth/userInfo.js";

export class AllFinance {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.showCategoryDate("today");

    this.btnCreateExpense = document.getElementById("btnCreateExpense");
    this.btnCreateFinance = document.getElementById("btnCreateFinance");

    this.todayBtn = document.getElementById("todayBtn");
    this.todayBtn.addEventListener("click", () =>
      this.showCategoryDate("today"),
    );
    this.todayBtn.classList.add("btn-secondary");
    this.todayBtn.classList.remove("btn-outline-secondary");
    this.weekBtn = document.getElementById("weekBtn");
    this.weekBtn.addEventListener("click", () => this.showCategoryDate("week"));
    this.monthBtn = document.getElementById("monthBtn");
    this.monthBtn.addEventListener("click", () =>
      this.showCategoryDate("month"),
    );
    this.yearBtn = document.getElementById("yearBtn");
    this.yearBtn.addEventListener("click", () => this.showCategoryDate("year"));
    this.allDateBtn = document.getElementById("allDateBtn");
    this.allDateBtn.addEventListener("click", () =>
      this.showCategoryDate("all"),
    );
    this.intervalBtn = document.getElementById("intervalBtn");
    this.intervalBtn.addEventListener("click", () =>
      this.showCategoryDate("interval"),
    );
    this.intervalFromInput = document.getElementById("datepicker");
    this.intervalToInput = document.getElementById("datepicker2");
    this.spanDatepicker = document.getElementById("span-datepicker");
    this.spanDatepicker2 = document.getElementById("span-datepicker2");
    this.intervalFromInput.addEventListener(
      "click",
      this.showDateInputDatepicker.bind(this),
    );
    this.intervalToInput.addEventListener(
      "click",
      this.showDateInputDatepicker2.bind(this),
    );
    this.intervalFromInput.addEventListener("input", () => {
      this.activateIntervalBtn();
    });
    this.intervalToInput.addEventListener("input", () => {
      this.activateIntervalBtn();
    });

    this.activeBtn();

    this.initModalCloseHandlers();
    this.openCreate();
  }

  openCreate() {
    this.btnCreateFinance.addEventListener("click", (e) => {
      e.preventDefault();
      this.openNewRoute("/allfinance-create?type=income");
    });
    this.btnCreateExpense.addEventListener("click", (e) => {
      e.preventDefault();
      this.openNewRoute("/allfinance-create?type=expense");
    });
  }

  openModal(date) {
    this.date = date;
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
        this.deleteCategory(this.date);
      });
    });
    footerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.closeModal();
      });
    });
  }

  activeBtn() {
    const btnWrapper = document.getElementById("btn-wrapper");
    btnWrapper.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;

      const allBtn = btnWrapper.querySelectorAll("button");
      allBtn.forEach((btn) => {
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-outline-secondary");
      });

      button.classList.add("btn-secondary");
      button.classList.remove("btn-outline-secondary");
    });
  }

  showDateInputDatepicker() {
    this.intervalFromInput.style.opacity = 1;
    this.spanDatepicker.style.opacity = 0;
    this.activateIntervalBtn();
  }

  showDateInputDatepicker2() {
    this.intervalToInput.style.opacity = 1;
    this.spanDatepicker2.style.opacity = 0;
    this.activateIntervalBtn();
  }

  activateIntervalBtn() {
    const fromDateFilled = this.intervalFromInput.value !== "";
    const toDateFilled = this.intervalToInput.value !== "";

    if (fromDateFilled && toDateFilled) {
      this.intervalBtn.removeAttribute("disabled");
    } else {
      this.intervalBtn.setAttribute("disabled", "disabled");
    }
  }

  showDate(data) {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);

    switch (data) {
      case "today":
        return {
          dateFrom: today,
          dateTo: today,
        };
      case "week":
        return {
          dateFrom: weekEnd.toISOString().slice(0, 10),
          dateTo: today,
        };
      case "month":
        return {
          dateFrom: monthAgo.toISOString().slice(0, 10),
          dateTo: today,
        };
      case "year":
        return {
          dateFrom: yearAgo.toISOString().slice(0, 10),
          dateTo: today,
        };
      case "all":
        return {
          dateFrom: "1970-01-01",
          dateTo: today,
        };
      case "interval":
        return {
          dateFrom: this.intervalFromInput.value,
          dateTo: this.intervalToInput.value,
        };
      default:
        return { dateFrom: today, dateTo: today };
    }
  }

  async showCategoryDate(data) {
    const periodDate = this.showDate(data);
    const result = await HttpUtils.request(
      "/operations?period=interval&dateFrom=" +
        periodDate.dateFrom +
        "&dateTo=" +
        periodDate.dateTo,
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
    this.showCategoryTable(result.response);
  }

  showCategoryTable(date) {
    const tableWrapper = document.getElementById("table-wrapper");
    const table = document.getElementById("table-finance");
    const tableBody = table.querySelector("tbody");
    tableBody.innerHTML = " ";
    for (let i = 0; i < date.length; i++) {
      const trElement = document.createElement("tr");
      trElement.insertCell().innerText = i + 1;
      if (date[i].type === "income") {
        const trTypeIncome = trElement.insertCell();
        trTypeIncome.innerText = "доход";
        trTypeIncome.classList.add("text-success");
      } else if (date[i].type === "expense") {
        const trTypeExpense = trElement.insertCell();
        trTypeExpense.innerText = "расход";
        trTypeExpense.classList.add("text-danger");
      }
      trElement.insertCell().innerText = date[i].category;
      trElement.insertCell().innerText = `${date[i].amount}$`;
      trElement.insertCell().innerText = this.formateDate(date[i].date);

      trElement.insertCell().innerText = date[i].comment;
      const iconsCell = trElement.insertCell();
      const deleteLink = document.createElement("a");
      deleteLink.href = "#";
      deleteLink.classList.add(
        "link-dark",
        "text-decoration-none",
        "delete-category",
        "me-2",
      );
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("bi", "bi-trash");
      deleteLink.appendChild(deleteIcon);
      iconsCell.appendChild(deleteLink);

      const editLink = document.createElement("a");
      editLink.href = "/allfinance-update";
      editLink.classList.add("link-dark", "text-decoration-none");
      const editIcon = document.createElement("i");
      editIcon.classList.add("bi", "bi-pencil");
      editLink.appendChild(editIcon);
      iconsCell.appendChild(editLink);

      trElement.style.borderBottom = "1px solid #dee2e6";
      trElement.style.height = "40px";
      tableBody.appendChild(trElement);
      table.appendChild(tableBody);
      tableWrapper.appendChild(table);

      editLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/allfinance-update?id=" + date[i].id);
      });

      deleteLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal(date[i]);
      });
    }
  }

  formateDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  async deleteCategory(date) {
    const id = date.id;
    const result = await HttpUtils.request("/operations/" + id, "DELETE");
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
