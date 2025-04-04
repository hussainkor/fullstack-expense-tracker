import React, { FormEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { convertDate, formatCurrency } from "../libs";

type TransactionDetailsPropsType = {
  setIsOpenView: (type: boolean) => void;
  selected: {
    source: string;
    description: string;
    createdat: Date;
    amount: number;
    type: string;
  };
};

export default function TransactionDetails({
  setIsOpenView,
  selected,
}: TransactionDetailsPropsType) {
  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center fixed z-20 top-0 left-0 bg-black/50 w-full h-full">
      <div className="flex flex-col w-screen relative md:w-1/4 py-3 px-3 bg-white dark:text-gray-700 rounded-md m-4">
        <IoIosCloseCircle
          size={30}
          className="cursor-pointer text-red-500 absolute right-2 top-2"
          onClick={() => setIsOpenView(false)}
        />
        <h2 className="py-2 text-xl dark:text-gray-900 border-b border-gray-100 mb-2">
          Transaction Details
        </h2>
        <div className="flex gap-5 border-b border-gray-100 pb-2 text-gray-400">
          <span>{selected?.source}</span>
          <IoCheckmarkDoneCircle className="text-emerald-600" size={24} />
        </div>
        <h3 className="mt-2">{selected?.description}</h3>
        <p className="text-gray-400 text-sm">
          {convertDate(selected?.createdat)}
        </p>
        <h2
          className={`pb-1 font-bold mt-3 ${
            selected?.type === "income" ? "text-green-500" : "text-red-500"
          } `}
        >
          {selected?.type === "income" ? "+" : "-"}
          {formatCurrency(selected?.amount)}
        </h2>
      </div>
    </div>
  );
}
