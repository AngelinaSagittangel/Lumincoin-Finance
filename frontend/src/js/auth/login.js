import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/");
    }

    this.inputEmail = document.getElementById("input-email");
    this.inputPassword = document.getElementById("input-password");
    this.rememberMe = document.getElementById("rememberMe");
    this.commonError = document.getElementById("common-error");

    document
      .getElementById("auth-button")
      .addEventListener("click", this.login.bind(this));
  }

  validateForm() {
    let isValid = true;

    if (
      this.inputEmail.value &&
      this.inputEmail.value.match(
        /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      )
    ) {
      this.inputEmail.classList.remove("is-invalid");
    } else {
      this.inputEmail.classList.add("is-invalid");
      isValid = false;
    }

    if (
      this.inputPassword.value &&
      this.inputPassword.value.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      )
    ) {
      this.inputPassword.classList.remove("is-invalid");
    } else {
      this.inputPassword.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  async login() {
    this.commonError.style.display = "none";
    if (this.validateForm()) {
      const result = await HttpUtils.request("/login", "POST", {
        email: this.inputEmail.value,
        password: this.inputPassword.value,
        rememberMe: this.rememberMe.checked,
      });

      if (
        result.error ||
        !result.response ||
        (result.response &&
          (!result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken ||
            !result.response.user.name ||
            !result.response.user.lastName ||
            !result.response.user.id))
      ) {
        this.commonError.style.display = "block";
        return;
      }

      AuthUtils.setAuthInfo(
        result.response.tokens.accessToken,
        result.response.tokens.refreshToken,
        {
          name: result.response.user.name,
          lastName: result.response.user.lastName,
          id: result.response.user.id,
        },
      );

      this.openNewRoute("/");
    }
  }
}
