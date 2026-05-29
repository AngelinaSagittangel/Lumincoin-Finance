import { AllFinanceCreate } from "./js/all-finance/all-finance-create.js";
import { AllFinanceUpdate } from "./js/all-finance/all-finance-update.js";
import { AllFinance } from "./js/all-finance/all-finance.js";
import { ExpensesCreate } from "./js/expenses/expenses-create.js";
import { ExpensesUpdate } from "./js/expenses/expenses-update.js";
import { Expenses } from "./js/expenses/expenses.js";
import { FinanceCreate } from "./js/finance/finance-create.js";
import { FinanceUpdate } from "./js/finance/finance-update.js";
import { Finance } from "./js/finance/finance.js";
import { Auth, Login } from "./js/auth/login.js";
import { Logout } from "./js/auth/logout.js";
import { Main } from "./js/main.js";
import { Registr, SignUp } from "./js/auth/sign-up.js";

export class Router {
  constructor() {
    this.titlePageElement = document.getElementById("title");
    this.contentPageElement = document.getElementById("content");
    this.initEvents();
    this.routes = [
      {
        route: "/",
        title: "Главная",
        filePathTemplates: "/templates/pages/main.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Main(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/login",
        title: "Авторизация",
        filePathTemplates: "/templates/pages/login.html",
        load: () => {
          new Login(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/signup",
        title: "Регистрация",
        filePathTemplates: "/templates/pages/sign-up.html",
        load: () => {
          new SignUp(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/logout",
        useLayout: "/templates/layout.html",
        load: () => {
          new Logout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/allfinance",
        title: "Расходы и доходы",
        filePathTemplates: "/templates/pages/all-finance.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new AllFinance(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/allfinance-create",
        title: "Расходы",
        filePathTemplates: "/templates/pages/create-all-finance.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new AllFinanceCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/allfinance-update",
        title: "Расходы",
        filePathTemplates: "/templates/pages/update-all-finance.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new AllFinanceUpdate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/finance",
        title: "Доходы",
        filePathTemplates: "/templates/pages/finance.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Finance(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/finance-create",
        title: "Создание дохода",
        filePathTemplates: "/templates/pages/create-category.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new FinanceCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/finance-update",
        title: "Редактирование дохода",
        filePathTemplates: "/templates/pages/update-category.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new FinanceUpdate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses",
        title: "Расходы",
        filePathTemplates: "/templates/pages/expenses.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expenses(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-create",
        title: "Расходы",
        filePathTemplates: "/templates/pages/expenses-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesCreate(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-update",
        title: "Расходы",
        filePathTemplates: "/templates/pages/expenses-update.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesUpdate(this.openNewRoute.bind(this));
        },
      },
    ];
  }

  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    window.addEventListener("click", this.clickHandler.bind(this));
  }

  async openNewRoute(url) {
    const currentRoute = window.location.pathname;
    history.pushState({}, "", url);
    await this.activateRoute(null, currentRoute);
  }

  async clickHandler(e) {
    let element = null;

    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }

    if (
      e.target.id === "logout-icon" ||
      (e.target.parentNode && e.target.parentNode.id === "logout-icon")
    ) {
      return;
    }

    if (element) {
      e.preventDefault();
      const currentRoute = window.location.pathname;
      const url = element.href.replace(window.location.origin, "");
      if (
        !url ||
        currentRoute === url.replace("#", "") ||
        url.startsWith("javascript:void(0)")
      ) {
        return;
      }

      await this.openNewRoute(url);
    }
  }

  async activateRoute(e, oldRoute = null) {
    if (oldRoute) {
      const currentRoute = this.routes.find((item) => item.route === oldRoute);
      if (currentRoute.styles && currentRoute.styles.length > 0) {
        currentRoute.styles.forEach((style) => {
          document.querySelector(`link[href='/css/${style}']`).remove();
        });
      }

      if (currentRoute.scripts && currentRoute.scripts.length > 0) {
        currentRoute.scripts.forEach((script) => {
          document.querySelector(`script[src='/js/${script}']`).remove();
        });
      }
    }

    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);
    if (newRoute) {
      if (newRoute.title) {
        this.titlePageElement.innerText =
          newRoute.title + " | Lumincoin Finance";
      }

      if (newRoute.filePathTemplates) {
        let contentBlock = this.contentPageElement;

        if (newRoute.useLayout) {
          this.contentPageElement.innerHTML = await fetch(
            newRoute.useLayout,
          ).then((response) => response.text());
          contentBlock = document.getElementById("content-layout");
        }
        contentBlock.innerHTML = await fetch(newRoute.filePathTemplates).then(
          (response) => response.text(),
        );
        this.activateMenuItem(newRoute);
      }
      if (newRoute.load && typeof newRoute.load === "function") {
        newRoute.load();
      }
    } else {
      console.log("Not Route Found");
      history.pushState({}, "", "/");
      await this.activateRoute();
    }
  }
  activateMenuItem(route) {
    document.querySelectorAll(".a-link").forEach((item) => {
      const href = item.getAttribute("href");
      if (
        (route.route.includes(href) && href !== "/") ||
        (route.route === "/" && href === "/")
      ) {
        item.classList.add("active");
        item.classList.remove("text-primary-emphasis");
      } else {
        item.classList.remove("active");
        item.classList.add("text-primary-emphasis");
      }
    });
    const categoryButton = document.querySelector(".select-button");
    const categoryLinks = document.querySelectorAll(".selecet-li-item");
    const isCategoryActive = Array.from(categoryLinks).some((link) => {
      return route.route.includes(link.getAttribute("href"));
    });
    if (isCategoryActive) {
      categoryButton.classList.add("active");
      categoryButton.classList.remove("text-primary-emphasis");
    } else {
      categoryButton.classList.remove("active");
      categoryButton.classList.add("text-primary-emphasis");
    }
  }
}
