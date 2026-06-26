import { LoginResponseType } from "../../types/login-response.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class Login {
  private inputEmail: HTMLInputElement | null;
  private inputPassword: HTMLInputElement | null;
  private rememberMe: HTMLInputElement | null;
  private commonError: HTMLElement | null;
  private openNewRoute: (path: string) => void;

  constructor(openNewRoute: (path: string) => void) {
    this.openNewRoute = openNewRoute;

    this.inputEmail = document.getElementById(
      "input-email",
    ) as HTMLInputElement | null;
    this.inputPassword = document.getElementById(
      "input-password",
    ) as HTMLInputElement | null;
    this.rememberMe = document.getElementById(
      "rememberMe",
    ) as HTMLInputElement | null;
    this.commonError = document.getElementById("common-error");

    const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);

    if (accessToken) {
      this.openNewRoute("/");
      return;
    }

    const authButton: HTMLElement | null =
      document.getElementById("auth-button");
    if (authButton) {
      authButton.addEventListener("click", this.login.bind(this));
    }
  }

  private validateForm(): boolean {
    if (!this.inputEmail || !this.inputPassword) {
      return false;
    }
    let isValid: boolean = true;

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

  private async login(): Promise<void> {
    if (this.commonError) {
      this.commonError.style.display = "none";
    }

    if (this.validateForm()) {
      if (!this.inputEmail || !this.inputPassword || !this.rememberMe) {
        return;
      }
      const result = await HttpUtils.request<LoginResponseType>("/login", "POST", false, {
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
        if (this.commonError) {
          this.commonError.style.display = "block";
        }

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
