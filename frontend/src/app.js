import "./styles/main.css";
import "./styles/layout.css";
import "./styles/all.finance.css";
import "./styles/expenses.css";
import "./styles/finance.css";

import { Router } from "./router.js";

class App {
  constructor() {
    new Router();
  }
}
new App();
