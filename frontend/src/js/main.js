import { Chart } from "chart.js/auto";
import { AuthUtils } from "../utils/auth-utils.js";
import { ModalLogout } from "./auth/modal-logout.js";
import { HttpUtils } from "../utils/http-utils.js";
import { UserInfo } from "./auth/userInfo.js";
import { UpdateBalance } from "./auth/update-balance.js";

export class Main {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;


    
    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }

    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.showCategoryDate("today");

    this.incomeChart = null;
    this.expenseChart = null;

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

    this.showIncomeChart(result.response);
    this.showExpenseChart(result.response);
  }

  showIncomeChart(result) {
    const ctx = document.getElementById("myChart").getContext("2d");
    if (this.incomeChart) {
      this.incomeChart.destroy();
    }
    const currentIncomeArray = {};
    const incomeArray = result.filter((item) => item.type === "income");
    incomeArray.forEach((item) => {
      const category = item.category;
      const amount = item.amount;
      if (!currentIncomeArray[category]) {
        currentIncomeArray[category] = amount;
      } else {
        currentIncomeArray[category] += amount;
      }
    });

    const labels = Object.keys(currentIncomeArray);
    const data = Object.values(currentIncomeArray);

    const colors = [
      "#20C997",
      "#0D6EFD",
      "#6F42C1",
      "#28A745",
      "#FF6347",
      "#7F8C8D",
      "#E37722",
    ];

    this.incomeChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Доходы",
            data: data,
            borderWidth: 1,
            backgroundColor: colors.slice(0, labels.length),
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  showExpenseChart(result) {
    const ctx = document.getElementById("myChart2").getContext("2d");
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }
    const expensesArray = result.filter((item) => item.type === "expense");
    const currentExpenseArray = {};

    expensesArray.forEach((item) => {
      const category = item.category;
      const amount = item.amount;
      if (!currentExpenseArray[category]) {
        currentExpenseArray[category] = amount;
      } else {
        currentExpenseArray[category] += amount;
      }
    });

    const labels = Object.keys(currentExpenseArray);
    const data = Object.values(currentExpenseArray);

    const colors = [
      "#DC3545",
      "#FD7E14",
      "#FFC107",
      "#20C997",
      "#0D6EFD",
      "#6F42C1",
      "#28A745",
      "#FF6347",
      "#7F8C8D",
      "#E37722",
    ];

    this.expenseChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Расходы",
            data: data,
            borderWidth: 1,
            backgroundColor: colors.slice(0, labels.length),
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
