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
        load: () => {},
      },
      {
        route: "/login",
        title: "Авторизация",
        filePathTemplates: "/templates/pages/auth.html",
        load: () => {},
      },
      {
        route: "/signup",
        title: "Регистрация",
        filePathTemplates: "/templates/pages/registr.html",
        load: () => {},
      },
    ];
  }

  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
  }

  async activateRoute() {
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);
    if (newRoute) {
      if (newRoute.title) {
        this.titlePageElement.innerText =
          newRoute.title + " | Lumincoin Finance";
      }
      if (newRoute.filePathTemplates) {
        this.contentPageElement.innerHTML = await fetch(
          newRoute.filePathTemplates,
        ).then((response) => response.text());
      }
    } else {
      console.log("No route found");
      window.location = "/";
    }
  }
}
