import { BalanceResponseType } from "../../types/balace-response.type";
import { HttpUtils } from "../../utils/http-utils";

interface getBalance {
  balance: number;
}

export class UpdateBalance {
  private static balanceUser: HTMLButtonElement | null = null;
  private static formModal: HTMLElement | null = null;
  private static textNewBalance: HTMLInputElement | null = null;
  private static btnExitBalance: HTMLElement | null = null;
  private static btnSaveBalance: HTMLElement | null = null;

  public static init(): void {
    UpdateBalance.balanceUser = document.getElementById(
      "balanceUser",
    ) as HTMLButtonElement | null;
    UpdateBalance.formModal = document.querySelector(
      ".modal-update-balance",
    ) as HTMLElement | null;
    UpdateBalance.textNewBalance = document.getElementById(
      "textNewBalance",
    ) as HTMLInputElement | null;
    UpdateBalance.btnExitBalance = document.getElementById(
      "btnExitBalance",
    ) as HTMLElement | null;
    UpdateBalance.btnSaveBalance = document.getElementById(
      "btnSaveBalance",
    ) as HTMLElement | null;

    if (!UpdateBalance.balanceUser || !UpdateBalance.formModal) {
      console.error(
        "UpdateBalance: Критические элементы не найдены в DOM. Компонент не будет работать.",
      );
      return;
    }

    UpdateBalance.balanceUser.addEventListener("click", (e) => {
      e.preventDefault();
      UpdateBalance.showModal();
    });

    UpdateBalance.initModalCloseHandlers();
  }

  private static showModal(): void {
    if (!UpdateBalance.formModal) {
      console.error("Модальное окно не найдено.");
      return;
    }
    UpdateBalance.formModal.classList.add("show");
    UpdateBalance.formModal.style.display = "block";
  }

  private static closeModal(): void {
    if (!UpdateBalance.formModal) return;
    UpdateBalance.formModal.classList.remove("show");
    UpdateBalance.formModal.style.display = "none";
  }

  private static initModalCloseHandlers(): void {
    if (UpdateBalance.btnExitBalance) {
      UpdateBalance.btnExitBalance.addEventListener("click", () => {
        UpdateBalance.closeModal();
      });
    }

    if (UpdateBalance.btnSaveBalance && UpdateBalance.textNewBalance) {
      UpdateBalance.btnSaveBalance.addEventListener("click", async () => {
        await UpdateBalance.updateBalance(UpdateBalance.textNewBalance);
      });
    }
  }

  public static async updateBalance(
    textNewBalance: HTMLInputElement | null,
  ): Promise<void> {
    if (!textNewBalance) {
      return;
    }

    const value = textNewBalance.value.trim();
    if (!value) {
      alert("Пожалуйста, введите сумму для обновления.");
      return;
    }

    const result = await HttpUtils.request<getBalance>(
      "/balance",
      "PUT",
      true,
      {
        newBalance: textNewBalance.value,
      },
    );
    if (result.redirect) {
      return;
    }
    if (
      result.error ||
      !result.response.balance
    ) {
      return alert("Ошибка при редактировании баланса");
    }
    if (UpdateBalance.balanceUser && result.response) {
      UpdateBalance.balanceUser.innerText = `${result.response.balance}$`;
    }
    UpdateBalance.closeModal();
  }
}
