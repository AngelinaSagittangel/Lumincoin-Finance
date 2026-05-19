export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (localStorage.getItem("accessToken")) {
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
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: this.inputEmail.value,
          password: this.inputPassword.value,
          rememberMe: this.rememberMe.checked,
        }),
      });

      const result = await response.json();

      if (
        result.error ||
        !result.tokens.accessToken ||
        !result.tokens.refreshToken ||
        !result.user.name ||
        !result.user.lastName ||
        !result.user.id
      ) {
        this.commonError.style.display = "block";
        return;
      }

      localStorage.setItem("accessToken", result.tokens.accessToken);
      localStorage.setItem("refreshToken", result.tokens.refreshToken);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          name: result.user.name,
          lastName: result.user.lastName,
          id: result.user.id,
        }),
      );

      this.openNewRoute("/");
      console.log(result);
    }
  }
}
