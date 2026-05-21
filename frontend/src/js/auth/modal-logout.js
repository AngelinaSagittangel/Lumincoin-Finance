import { Logout } from "./logout.js";

export class ModalLogout {
  static init() {
    const logoutIcon = document.getElementById("logout-icon");

    if (logoutIcon) {
      logoutIcon.addEventListener("click", (e) => {
        e.preventDefault();
        this.showModal();
      });
    }
  }

  static showModal() {
    const formModal = document.querySelector(".modal-logout");
    const btnFalseExit = document.getElementById("btnFalseExit");

    formModal.classList.toggle("show");
    formModal.style.display = "block";


    if (btnFalseExit) {
      btnFalseExit.addEventListener("click", () => {
        formModal.classList.toggle("show");
        formModal.style.display = "none";
      });
    }
  }
}
