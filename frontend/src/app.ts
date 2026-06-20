
import "./styles/main.css";
import "./styles/layout.css";
import "./styles/all.finance.css";
import "./styles/expenses.css";
import "./styles/finance.css";

import { Router } from "./router";

class App {
  constructor() {
    const $ = (window as any).$;
    new Router();
  }
}
new App();
