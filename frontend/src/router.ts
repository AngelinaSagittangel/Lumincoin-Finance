import { AllFinanceCreate } from "./js/all-finance/all-finance-create";
import { AllFinanceUpdate } from "./js/all-finance/all-finance-update";
import { AllFinance } from "./js/all-finance/all-finance";
import { ExpensesCreate } from "./js/expenses/expenses-create";
import { ExpensesUpdate } from "./js/expenses/expenses-update";
import { Expenses } from "./js/expenses/expenses";
import { FinanceCreate } from "./js/finance/finance-create";
import { FinanceUpdate } from "./js/finance/finance-update";
import { Finance } from "./js/finance/finance";
import { Login } from "./js/auth/login";
import { Logout } from "./js/auth/logout";
import { Main } from "./js/main";
import { SignUp } from "./js/auth/sign-up";
import { RouteType } from "./types/route.type";

export class Router {
  private titlePageElement: HTMLElement | null;
  private contentPageElement: HTMLElement | null;

  private routes: RouteType[];

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

  private initEvents(): void {
    window.addEventListener("DOMContentLoaded", () => {
      this.activateRoute();
    });
    window.addEventListener("popstate", () => {
      this.activateRoute();
    });
    window.addEventListener("click", this.clickHandler.bind(this));
  }

  public async openNewRoute(url: string): Promise<void> {
    // const currentRoute: string | null = window.location.pathname;
    history.pushState({}, "", url);
    await this.activateRoute();
  }

  async clickHandler(e: MouseEvent): Promise<void> {
    let element: HTMLAnchorElement | null = null;
    if (!(e.target instanceof HTMLElement)) {
      return;
    }

    const target = e.target;
    const parent = target.parentElement;

    if (target.nodeName === "A") {
      element = target as HTMLAnchorElement;
    } else if (parent && parent.nodeName === "A") {
      element = parent as HTMLAnchorElement;
    }

    if (
      target.id === "logout-icon" ||
      (parent && parent.id === "logout-icon")
    ) {
      return;
    }

    if (element) {
      e.preventDefault();
      const currentRoute: string = window.location.pathname;
      const url: string = element.href.replace(window.location.origin, "");
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

  private async activateRoute(): Promise<void> {

    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);
    if (newRoute) {
      if (newRoute.title && this.titlePageElement) {
        this.titlePageElement.innerText =
          newRoute.title + " | Lumincoin Finance";
      }

      if (newRoute.filePathTemplates) {
        let contentBlock: HTMLElement | null = this.contentPageElement;

        if (newRoute.useLayout) {
          if (this.contentPageElement) {
            this.contentPageElement.innerHTML = await fetch(
              newRoute.useLayout,
            ).then((response) => response.text());
            contentBlock = document.getElementById("content-layout");
          }
        }

        if (contentBlock) {
          contentBlock.innerHTML = await fetch(newRoute.filePathTemplates).then(
            (response) => response.text(),
          );
        }

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

  private activateMenuItem(route: RouteType | undefined): void {
    if (!route) return;
    document.querySelectorAll(".a-link").forEach((item) => {
      const href: string | null = item.getAttribute("href");
      if (!href) return;

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
    const isCategoryActive = route
      ? Array.from(categoryLinks).some((link) => {
          const linkHref = link.getAttribute("href");
          return linkHref ? route.route.includes(linkHref) : false;
        })
      : false;

    if (isCategoryActive && categoryButton) {
      categoryButton.classList.add("active");
      categoryButton.classList.remove("text-primary-emphasis");
    } else if (categoryButton) {
      categoryButton.classList.remove("active");
      categoryButton.classList.add("text-primary-emphasis");
    }
  }
}
