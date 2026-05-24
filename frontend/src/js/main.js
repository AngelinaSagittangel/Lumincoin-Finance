import { Chart } from "chart.js/auto";
import { AuthUtils } from "../utils/auth-utils.js";
import { ModalLogout } from "./auth/modal-logout.js";

export class Main {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/login");
    }
    ModalLogout.init();

    this.showChart();
  }

  showChart() {
    const ctx = document.getElementById("myChart").getContext("2d");
    const ctx2 = document.getElementById("myChart2").getContext("2d");

    const navAllFinanceBtn = document.getElementById("nav-all-finance-btn");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [4, 3, 5, 2, 5],
            borderWidth: 1,
            backgroundColor: [
              "#DC3545",
              "#FD7E14",
              "#FFC107",
              "#20C997",
              "#0D6EFD",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
      },
    });

    new Chart(ctx2, {
      type: "pie",
      data: {
        labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [4, 3, 5, 2, 5],
            borderWidth: 1,
            backgroundColor: [
              "#DC3545",
              "#FD7E14",
              "#FFC107",
              "#20C997",
              "#0D6EFD",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
      },
    });
  }
}
