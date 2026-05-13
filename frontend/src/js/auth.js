

const authForm = document.getElementById("auth-form");
const inputEmail = document.getElementById("input-email");
const inputPassword = document.getElementById("input-password");

document.getElementById("auth-button").addEventListener("click", validateForm);


function validateForm() {

  let isValid = true;

  if (
    inputEmail.value &&
    inputEmail.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
  ) {
    inputEmail.classList.remove("is-invalid");
  } else {
    inputEmail.classList.add("is-invalid");
    isValid = false;
  }
  
      if (inputPassword.value && inputPassword.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
          inputPassword.classList.remove('is-invalid');
      
      } else {
          inputPassword.classList.add('is-invalid');
          isValid = false;
      }
  
//    return isValid;

   if (isValid === true) {
    location.href = 'main.html'
   }
}
