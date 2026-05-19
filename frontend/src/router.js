import { AllFinance } from "./js/all-finance.js";
import { Expenses } from "./js/expenses.js";
import { Finance } from "./js/finance.js";
import { Auth, Login } from "./js/login.js";
import { Logout } from "./js/logout.js";
import { Main } from "./js/main.js";
import { Registr, SignUp } from "./js/sign-up.js";

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
          
        },
      },
      {
        route: "/allfinance-update",
        title: "Расходы",
        filePathTemplates: "/templates/pages/update-all-finance.html",
        useLayout: "/templates/layout.html",
        load: () => {
          
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
        },
      },
            {
        route: "/finance-udpate",
        title: "Редактирование дохода",
        filePathTemplates: "/templates/pages/update-category.html",
        useLayout: "/templates/layout.html",
        load: () => {
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
        },
      },
      {
        route: "/expenses-update",
        title: "Расходы",
        filePathTemplates: "/templates/pages/expenses-update.html",
        useLayout: "/templates/layout.html",
        load: () => {
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
}
