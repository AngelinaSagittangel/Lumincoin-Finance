import { AuthUtils } from "../../utils/auth-utils.js";
import { HttpUtils } from "../../utils/http-utils.js";

export class SignUp {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute("/");
    }

    this.inputName = document.getElementById("input-name");
    this.inputLastName = document.getElementById("input-lastName");
    this.inputEmail = document.getElementById("input-email");
    this.inputPassword = document.getElementById("input-password");
    this.inputPasswordRepeat = document.getElementById("input-password-repeat");
    this.rememberMe = document.getElementById("rememberMe");
    this.commonError = document.getElementById("common-error");

    document
      .getElementById("registr-button")
      .addEventListener("click", this.signUp.bind(this));
  }

  validateForm() {
    let isValid = true;

    if (
      this.inputName.value &&
      this.inputName.value.match(/^[А-ЯЁ][а-яё\s]*$/)
    ) {
      this.inputName.classList.remove("is-invalid");
    } else {
      this.inputName.classList.add("is-invalid");
      isValid = false;
    }

    if (
      this.inputLastName.value &&
      this.inputLastName.value.match(/^[А-ЯЁ][а-яё\s]*$/)
    ) {
      this.inputLastName.classList.remove("is-invalid");
    } else {
      this.inputLastName.classList.add("is-invalid");
      isValid = false;
    }

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

    if (
      this.inputPasswordRepeat.value &&
      this.inputPasswordRepeat.value === this.inputPassword.value
    ) {
      this.inputPasswordRepeat.classList.remove("is-invalid");
    } else {
      this.inputPasswordRepeat.classList.add("is-invalid");
      isValid = false;
    }

    return isValid;
  }

  async signUp() {
    this.commonError.style.display = "none";
    if (this.validateForm()) {
      const result = await HttpUtils.request("/signup", "POST", false, {
        name: this.inputName.value,
        lastName: this.inputLastName.value,
        email: this.inputEmail.value,
        password: this.inputPassword.value,
        passwordRepeat: this.inputPasswordRepeat.value,
      });

      if (
        result.error ||
        !result.response ||
        (result.response &&
          (!result.response.user.name ||
            !result.response.user.lastName ||
            !result.response.user.id ||
            !result.response.user.email))
      ) {
        this.commonError.style.display = "block";
        return;
      }

      AuthUtils.setUserInfo({
        name: result.response.user.name,
        lastName: result.response.user.lastName,
        id: result.response.user.id,
        email: result.response.user.email,
      });

      this.openNewRoute("/");
    }
  }
}
