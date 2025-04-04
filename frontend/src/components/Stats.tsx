import React from "react";
import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { SiCashapp } from "react-icons/si";
import { formatCurrency } from "../libs";
import Card from "./Card";

const ICON_STYLE = [
  "bg-blue-300 text-blue-800",
  "bg-emerald-300 text-emerald-800",
  "bg-rose-300 text-rose-800",
];
type DashBoardPropType = {
  dt: {
    availableBalance: number;
    totalIncome: number;
    totalExpense: number;
  };
};
type StatProp = {
  index: number;
  item: {
    icon: React.ReactElement;
    label: string;
    amount: number;
    increase: number;
  };
};

export default function Stats({ dt }: DashBoardPropType) {
  const data = [
    {
      label: "Total Balance",
      amount: dt?.availableBalance,
      increase: 10.9,
      icon: <BsCurrencyDollar size={26} />,
    },
    {
      label: "Total Income",
      amount: dt?.totalIncome,
      increase: 8.9,
      icon: <BsCashCoin size={26} />,
    },
    {
      label: "Total Expense",
      amount: dt?.totalExpense,
      increase: -10.9,
      icon: <SiCashapp size={26} />,
    },
  ];
  return (
    <div className="flex flex-col items-center justify-between gap-8 mb-20 md:flex-row 2xl:gap-x-40">
      <div className="flex flex-col items-center justify-between w-full gap-10 md:flex-row 2xl:gap-20">
        {data.map((item, index) => (
          <ItemCard key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

const ItemCard = ({ item, index }: StatProp) => {
  return (
    <Card className="flex items-center justify-between w-full h-48 gap-5 px-4 py-12 shadow-lg 2xl:min-w-96 2xl:px-8 dark:border-slate-500">
      <div className="flex items-center w-full h-full gap-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${ICON_STYLE[index]}`}
        >
          {item.icon}
        </div>
        <div className="space-y-3">
          <span className="text-base text-gray-600 dark:text-gray-400 md:text-lg">
            {item.label}
          </span>
          <p className="text-2xl font-medium text-black 2xl:text-3xl dark:text-gray-400">
            {formatCurrency(item?.amount || 0.0)}
          </p>
          <span className="text-xs md:text-sm 2xl:text-base text-gray-600 dark:text-gray-500">
            Overall {item.label}
          </span>
        </div>
      </div>
    </Card>
  );
};
