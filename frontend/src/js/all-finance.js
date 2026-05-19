export class AllFinance {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if (!localStorage.getItem("accessToken")) {
      return this.openNewRoute("/login");
    }

    const deleteButtons = document.querySelectorAll(".delete-category");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", openModal);
    });

    const formModal = document.querySelector(".modal-finance");

    function openModal() {
      formModal.classList.toggle("show");
      formModal.style.display = "block";
    }

    const modalFooter = document.querySelector(".modal-footer");
    const footerButtons = modalFooter.querySelectorAll("button");

    footerButtons.forEach((button) => {
      button.addEventListener("click", closeModal);
    });

    function closeModal() {
      formModal.classList.toggle("show");
      formModal.style.display = "none";
    }
  }
}
