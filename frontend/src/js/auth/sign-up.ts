import { SignupResponseType } from "../../types/signup-response.type";
import { UserInfoType } from "../../types/user-info.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class SignUp {
  private inputName: HTMLInputElement | null;
  private inputLastName: HTMLInputElement | null;
  private inputEmail: HTMLInputElement | null;
  private inputPassword: HTMLInputElement | null;
  private inputPasswordRepeat: HTMLInputElement | null;
  private rememberMe: HTMLInputElement | null;
  private commonError: HTMLElement | null;
  private openNewRoute: (path: string) => void;

  constructor(openNewRoute: (path: string) => void) {
    this.openNewRoute = openNewRoute;
    this.inputName = document.getElementById(
      "input-name",
    ) as HTMLInputElement | null;
    this.inputLastName = document.getElementById(
      "input-lastName",
    ) as HTMLInputElement | null;
    this.inputEmail = document.getElementById(
      "input-email",
    ) as HTMLInputElement | null;
    this.inputPassword = document.getElementById(
      "input-password",
    ) as HTMLInputElement | null;
    this.inputPasswordRepeat = document.getElementById(
      "input-password-repeat",
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

    const registrButton: HTMLElement | null =
      document.getElementById("registr-button");

    if (registrButton) {
      registrButton.addEventListener("click", this.signUp.bind(this));
    }
  }

  private validateForm(): boolean {
    if (
      !this.inputName ||
      !this.inputLastName ||
      !this.inputEmail ||
      !this.inputPassword ||
      !this.inputPasswordRepeat
    ) {
      return false;
    }
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

  public async signUp(): Promise<void> {
    if (this.commonError) {
      this.commonError.style.display = "none";
    }

    if (this.validateForm()) {
      if (
        !this.inputName ||
        !this.inputLastName ||
        !this.inputEmail ||
        !this.inputPassword ||
        !this.inputPasswordRepeat
      ) {
        return;
      }
      const result = await HttpUtils.request<SignupResponseType>(
        "/signup",
        "POST",
        false,
        {
          name: this.inputName.value,
          lastName: this.inputLastName.value,
          email: this.inputEmail.value,
          password: this.inputPassword.value,
          passwordRepeat: this.inputPasswordRepeat.value,
        },
      );

      if (
        result.error ||
        !result.response ||
        (result.response &&
          (!result.response.user.name ||
            !result.response.user.lastName ||
            !result.response.user.id ||
            !result.response.user.email))
      ) {
        if (this.commonError) {
          this.commonError.style.display = "block";
        }

        return;
      }

      AuthUtils.setUserInfo({
        id: result.response.user.id,
        email: result.response.user.email,
        name: result.response.user.name,
        lastName: result.response.user.lastName,
      });

      this.openNewRoute("/");
    }
  }
}
