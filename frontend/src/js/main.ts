import { Chart } from "chart.js/auto";
import { AuthUtils } from "../utils/auth-utils";
import { ModalLogout } from "./auth/modal-logout";
import { HttpUtils } from "../utils/http-utils";
import { UserInfo } from "./auth/userInfo";
import { UpdateBalance } from "./auth/update-balance";
import { AllFinanceType } from "../types/all-finance.type";

interface Operation {
  type: "income" | "expense";
  category: string;
  amount: number;
}

export class Main {
  private openNewRoute: (path: string) => Promise<void>;

  private incomeChart: Chart<"pie"> | null = null;
  private expenseChart: Chart<"pie"> | null = null;

  private todayBtn: HTMLElement | null = null;
  private weekBtn: HTMLElement | null = null;
  private monthBtn: HTMLElement | null = null;
  private yearBtn: HTMLElement | null = null;
  private allDateBtn: HTMLElement | null = null;
  private intervalBtn: HTMLElement | null = null;

  private intervalFromInput: HTMLInputElement | null = null;
  private intervalToInput: HTMLInputElement | null = null;
  private spanDatepicker: HTMLElement | null = null;
  private spanDatepicker2: HTMLElement | null = null;

  constructor(openNewRoute: (path: string) => Promise<void>) {
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

    const hasIncomeChart = !!document.getElementById("myChart");
    const hasExpenseChart = !!document.getElementById("myChart2");

    if (hasIncomeChart || hasExpenseChart) {
      this.showCategoryDate("today");
    }

    this.todayBtn = document.getElementById("todayBtn") as HTMLElement | null;
    this.weekBtn = document.getElementById("weekBtn") as HTMLElement | null;
    this.monthBtn = document.getElementById("monthBtn") as HTMLElement | null;
    this.yearBtn = document.getElementById("yearBtn") as HTMLElement | null;
    this.allDateBtn = document.getElementById(
      "allDateBtn",
    ) as HTMLElement | null;
    this.intervalBtn = document.getElementById(
      "intervalBtn",
    ) as HTMLElement | null;

    this.intervalFromInput = document.getElementById(
      "datepicker",
    ) as HTMLInputElement | null;
    this.intervalToInput = document.getElementById(
      "datepicker2",
    ) as HTMLInputElement | null;
    this.spanDatepicker = document.getElementById(
      "span-datepicker",
    ) as HTMLElement | null;
    this.spanDatepicker2 = document.getElementById(
      "span-datepicker2",
    ) as HTMLElement | null;

    if (this.todayBtn) {
      this.todayBtn.addEventListener("click", () =>
        this.showCategoryDate("today"),
      );
      this.todayBtn.classList.add("btn-secondary");
      this.todayBtn.classList.remove("btn-outline-secondary");
    }

    if (this.weekBtn) {
      this.weekBtn.addEventListener("click", () =>
        this.showCategoryDate("week"),
      );
    }
    if (this.monthBtn) {
      this.monthBtn.addEventListener("click", () =>
        this.showCategoryDate("month"),
      );
    }
    if (this.yearBtn) {
      this.yearBtn.addEventListener("click", () =>
        this.showCategoryDate("year"),
      );
    }
    if (this.allDateBtn) {
      this.allDateBtn.addEventListener("click", () =>
        this.showCategoryDate("all"),
      );
    }
    if (this.intervalBtn) {
      this.intervalBtn.addEventListener("click", () =>
        this.showCategoryDate("interval"),
      );
    }

    if (this.intervalFromInput) {
      this.intervalFromInput.addEventListener(
        "click",
        this.showDateInputDatepicker.bind(this),
      );
      this.intervalFromInput.addEventListener("input", () => {
        this.activateIntervalBtn();
      });
    }
    if (this.intervalToInput) {
      this.intervalToInput.addEventListener(
        "click",
        this.showDateInputDatepicker2.bind(this),
      );
      this.intervalToInput.addEventListener("input", () => {
        this.activateIntervalBtn();
      });
    }

    this.activeBtn();
    this.showCategoryDate("today");
  }

  private activeBtn(): void {
    const btnWrapper: HTMLElement | null =
      document.getElementById("btn-wrapper");

    if (!btnWrapper) {
      return;
    }
    btnWrapper.addEventListener("click", (event) => {
      if (!event.target) return;
      const button = (event.target as Element).closest("button");
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

  private showDateInputDatepicker(): void {
    if (!this.intervalFromInput || !this.spanDatepicker) {
      return;
    }
    this.intervalFromInput.style.opacity = "1";
    this.spanDatepicker.style.opacity = "0";
    this.activateIntervalBtn();
  }
  private showDateInputDatepicker2(): void {
    if (!this.intervalToInput || !this.spanDatepicker2) return;
    this.intervalToInput.style.opacity = "1";
    this.spanDatepicker2.style.opacity = "0";
    this.activateIntervalBtn();
  }

  private activateIntervalBtn(): void {
    if (!this.intervalBtn || !this.intervalFromInput || !this.intervalToInput)
      return;
    const fromDateFilled = this.intervalFromInput.value !== "";
    const toDateFilled = this.intervalToInput.value !== "";

    if (fromDateFilled && toDateFilled) {
      this.intervalBtn.removeAttribute("disabled");
    } else {
      this.intervalBtn.setAttribute("disabled", "disabled");
    }
  }

  private showDate(period: string): { dateFrom: string; dateTo: string } {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const yearAgo = new Date(now);
    yearAgo.setFullYear(now.getFullYear() - 1);

    switch (period) {
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
      case "interval": {
        const from = this.intervalFromInput?.value.trim();
        const to = this.intervalToInput?.value.trim();
        return { dateFrom: from || today, dateTo: to || today };
      }
      default:
        return { dateFrom: today, dateTo: today };
    }
  }

  private async showCategoryDate(data: string): Promise<void> {
    const periodDate = this.showDate(data);

    const result = await HttpUtils.request<AllFinanceType[]>(
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
      (result.response && result.response.length < 0)
    ) {
      return console.error(result.error);
    }

    this.showIncomeChart(result.response);
    this.showExpenseChart(result.response);
  }

  private showIncomeChart(operations: Operation[]): void {
    const canvas: HTMLCanvasElement | null = document.getElementById(
      "myChart",
    ) as HTMLCanvasElement | null;

    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (this.incomeChart) {
      this.incomeChart.destroy();
    }
    const currentIncomeArray: Record<string, number> = {};
    const incomeArray = operations.filter((item) => item.type === "income");

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

  private showExpenseChart(operations: Operation[]): void {
    const canvas = document.getElementById(
      "myChart2",
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    if (this.expenseChart) {
      this.expenseChart.destroy();
    }

    const expensesArray = operations.filter((item) => item.type === "expense");
    const currentExpenseArray: Record<string, number> = {};

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
