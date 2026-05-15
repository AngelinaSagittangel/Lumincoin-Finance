export class Main {
  constructor() {
    const ctx = document.getElementById("myChart").getContext("2d");
    const ctx2 = document.getElementById("myChart2").getContext("2d");

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [4, 3, 5, 2, 5],
            borderWidth: 1,
            backgroundColor: [
              "#DC3545",
              "#FD7E14",
              "#FFC107",
              "#20C997",
              "#0D6EFD",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
      },
    });

    new Chart(ctx2, {
      type: "pie",
      data: {
        labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [4, 3, 5, 2, 5],
            borderWidth: 1,
            backgroundColor: [
              "#DC3545",
              "#FD7E14",
              "#FFC107",
              "#20C997",
              "#0D6EFD",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
      },
    });
  }
}
