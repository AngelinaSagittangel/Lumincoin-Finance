export class ModalLogout {
  static init(): void {
    const logoutIcon: HTMLElement | null =
      document.getElementById("logout-icon");

    if (logoutIcon) {
      logoutIcon.addEventListener("click", (e) => {
        e.preventDefault();
        this.showModal();
      });
    }
  }

  public static showModal(): void {
    const formModal: HTMLElement | null =
      document.querySelector(".modal-logout");
    const btnFalseExit: HTMLElement | null =
      document.getElementById("btnFalseExit");

    if (formModal) {
      formModal.classList.toggle("show");
      formModal.style.display = "block";
    }

    if (btnFalseExit) {
      btnFalseExit.addEventListener("click", () => {
        if (formModal) {
          formModal.classList.toggle("show");
          formModal.style.display = "none";
        }
      });
    }
  }
}
