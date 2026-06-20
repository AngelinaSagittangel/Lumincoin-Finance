import { HttpUtils } from "../../utils/http-utils";
import { ModalLogout } from "../auth/modal-logout";
import { UpdateBalance } from "../auth/update-balance";
import { UserInfo } from "../auth/userInfo";

export class AllFinance {
  private btnCreateExpense: HTMLElement | null = null;
  private btnCreateFinance: HTMLElement | null = null;
  
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

  private date: any = null;
  private openNewRoute: (path: string) => Promise<void>;
  constructor(openNewRoute: (path: string) => Promise<void>) {
    this.openNewRoute = openNewRoute;

    ModalLogout.init();
    UserInfo.balance(this.openNewRoute);
    UserInfo.userName();
    UpdateBalance.init();
    this.showCategoryDate("today");

    this.btnCreateExpense = document.getElementById("btnCreateExpense");
    this.btnCreateFinance = document.getElementById("btnCreateFinance");

    this.todayBtn = document.getElementById("todayBtn");
    if (this.todayBtn) {
      this.todayBtn.addEventListener("click", () =>
        this.showCategoryDate("today"),
      );
      this.todayBtn.classList.add("btn-secondary");
      this.todayBtn.classList.remove("btn-outline-secondary");
    }

    this.weekBtn = document.getElementById("weekBtn");
    if (this.weekBtn) {
      this.weekBtn.addEventListener("click", () =>
        this.showCategoryDate("week"),
      );
    }

    this.monthBtn = document.getElementById("monthBtn");
    if (this.monthBtn) {
      this.monthBtn.addEventListener("click", () =>
        this.showCategoryDate("month"),
      );
    }

    this.yearBtn = document.getElementById("yearBtn");
    if (this.yearBtn) {
      this.yearBtn.addEventListener("click", () =>
        this.showCategoryDate("year"),
      );
    }

    this.allDateBtn = document.getElementById("allDateBtn");
    if (this.allDateBtn) {
      this.allDateBtn.addEventListener("click", () =>
        this.showCategoryDate("all"),
      );
    }

    this.intervalBtn = document.getElementById("intervalBtn");
    if (this.intervalBtn) {
      this.intervalBtn.addEventListener("click", () =>
        this.showCategoryDate("interval"),
      );
    }

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

    if (this.intervalFromInput) {
      this.intervalFromInput.addEventListener(
        "click",
        this.showDateInputDatepicker.bind(this),
      );
    }

    if (this.intervalToInput) {
      this.intervalToInput.addEventListener(
        "click",
        this.showDateInputDatepicker2.bind(this),
      );
    }

    if (this.intervalFromInput) {
      this.intervalFromInput.addEventListener("input", () => {
        this.activateIntervalBtn();
      });
    }

    if (this.intervalToInput) {
      this.intervalToInput.addEventListener("input", () => {
        this.activateIntervalBtn();
      });
    }

    this.activeBtn();

    this.initModalCloseHandlers();
    this.openCreate();
  }

  private openCreate(): void {
    if (this.btnCreateFinance) {
      this.btnCreateFinance.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/allfinance-create?type=income");
      });
    }
    if (this.btnCreateExpense) {
      this.btnCreateExpense.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/allfinance-create?type=expense");
      });
    }
  }

  private openModal(date: any): void {
    this.date = date;
    const formModal: HTMLElement | null =
      document.querySelector(".modal-finance");

    if (formModal) {
      formModal.classList.add("show");
      formModal.style.display = "block";
    }
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

  private activeBtn(): void {
    const btnWrapper = document.getElementById("btn-wrapper");
    if (!btnWrapper) return;
    btnWrapper.addEventListener("click", (event) => {
      if (!event.target) return;
      const target = event.target as unknown as HTMLElement | null;
      const button = target?.closest("button") as HTMLElement | null;
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
    if (this.intervalFromInput) {
      this.intervalFromInput.style.opacity = "1";
    }
    if (this.spanDatepicker) {
      this.spanDatepicker.style.opacity = "0";
    }
    this.activateIntervalBtn();
  }

  private showDateInputDatepicker2(): void {
    if (this.intervalToInput) {
      this.intervalToInput.style.opacity = "1";
    }
    if (this.spanDatepicker2) {
      this.spanDatepicker2.style.opacity = "0";
    }
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

  private showDate(data: string): { dateFrom: string; dateTo: string } {
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
        if (!this.intervalFromInput || !this.intervalToInput) {
          return { dateFrom: today, dateTo: today };
        }

        const from = this.intervalFromInput.value.trim();
        const to = this.intervalToInput.value.trim();

        if (!from || !to) {
          return { dateFrom: today, dateTo: today };
        }

        return { dateFrom: from, dateTo: to };

      default:
        return { dateFrom: today, dateTo: today };
    }
  }

  private async showCategoryDate(
    data: "today" | "week" | "month" | "year" | "all" | "interval",
  ): Promise<void> {
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

  private showCategoryTable(
    data: Array<{
      id: number;
      type: "income" | "expense";
      category: string;
      amount: number;
      date: string;
      comment?: string;
    }>,
  ): void {
    const tableWrapper = document.getElementById(
      "table-wrapper",
    ) as HTMLElement | null;
    const table = document.getElementById(
      "table-finance",
    ) as HTMLTableElement | null;

    if (!tableWrapper || !table) {
      return;
    }

    const tableBody = table.querySelector(
      "tbody",
    ) as HTMLTableSectionElement | null;
    if (!tableBody) {
      return;
    }

    tableBody.innerHTML = "";

    data.forEach((item, index) => {
      const trElement = document.createElement("tr");

      trElement.style.borderBottom = "1px solid #dee2e6";
      trElement.style.height = "40px";

      trElement.insertCell().innerText = (index + 1).toString();

      const typeCell = trElement.insertCell();
      if (item.type === "income") {
        typeCell.innerText = "доход";
        typeCell.classList.add("text-success");
      } else {
        typeCell.innerText = "расход";
        typeCell.classList.add("text-danger");
      }

      trElement.insertCell().innerText = item.category || "-";

      trElement.insertCell().innerText = `${item.amount}$`;

      trElement.insertCell().innerText = this.formateDate(item.date);

      trElement.insertCell().innerText = item.comment || "-";

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

      editLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openNewRoute("/allfinance-update?id=" + item.id);
      });

      deleteLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.openModal(item);
      });

      tableBody.appendChild(trElement);
    });
  }

  private formateDate(date: string | undefined): string {
    if (!date) {
      return "-";
    }
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  private async deleteCategory(item: { id: number }): Promise<void> {
    const { id } = item;
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
