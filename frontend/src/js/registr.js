const registrForm = document.getElementById("registr-form");
const inputName = document.getElementById("input-name");
const inputlastName = document.getElementById("input-lastName");
const inputEmail = document.getElementById("input-email");
const inputPassword = document.getElementById("input-password");
const inputPasswordRepeat = document.getElementById("input-password-repeat");

document
  .getElementById("registr-button")
  .addEventListener("click", validateForm);

function validateForm() {
  let isValid = true;

  if (inputName.value &&
    inputName.value.match(/^[А-ЯЁ][а-яё\s]*$/)
  ) {
    inputName.classList.remove("is-invalid");
  } else {
    inputName.classList.add("is-invalid");
    isValid = false;
  }

  if (inputlastName.value &&
    inputlastName.value.match(/^[А-ЯЁ][а-яё\s]*$/)) {
    inputlastName.classList.remove("is-invalid");
  } else {
    inputlastName.classList.add("is-invalid");
    isValid = false;
  }

  if (
    inputEmail.value &&
    inputEmail.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
  ) {
    inputEmail.classList.remove("is-invalid");
  } else {
    inputEmail.classList.add("is-invalid");
    isValid = false;
  }

  if (
    inputPassword.value &&
    inputPassword.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
  ) {
    inputPassword.classList.remove("is-invalid");
  } else {
    inputPassword.classList.add("is-invalid");
    isValid = false;
  }

  if (inputPasswordRepeat.value) {
    inputPasswordRepeat.classList.remove("is-invalid");
  } else {
    inputPasswordRepeat.classList.add("is-invalid");
    isValid = false;
  }

//   return isValid;
  registration(isValid);
}

function registration(isValid) {
  if (isValid === true && inputPasswordRepeat.value === inputPassword.value) {
    location.href = "main.html";
  } else {
    inputPasswordRepeat.classList.add("is-invalid");
    isValid = false;
  }
}
