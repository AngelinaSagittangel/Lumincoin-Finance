export type AllFinanceType = {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  comment?: string;
};



export type CategoryType = {
  id: number;
  title: string;
};
