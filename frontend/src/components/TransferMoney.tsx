import React, { FormEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import api from "../libs/apiCall";

type AddAccountType = {
  isTransferMoney: boolean;
  setIsTransferMoney: (type: boolean) => void;
  fromAccount: { account_name: string; id: number };
  fetchAccount: () => void;
};

const accounts = ["Cryptos", "Paypal", "Cash", "Visa Card"];

export default function TransferMoney({
  isTransferMoney,
  setIsTransferMoney,
  fromAccount,
  fetchAccount,
}: AddAccountType) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [toAccount, setToAccount] = useState("");
  const [fromAccoundId, setFromAccountId] = useState();
  const [toAccoundId, setToAccountId] = useState();

  const handleTransferAccount = async (e: FormEvent) => {
    e.preventDefault();
    const amounts = Number(amount);

    try {
      setLoading(true);
      if (!toAccount) {
        toast.error("Select Transfer Account");
      } else if (amounts < 100) {
        toast.error("Minimum amount should be 100");
      } else if (isNaN(amounts)) {
        toast.error("Amount should be in number");
      } else {
        const transfer = {
          from_account: fromAccoundId,
          to_account: toAccoundId,
          amount: amounts,
        };
        const { data: res } = await api.put("/transfer-money", transfer);
        toast.success(res?.message);
        fetchAccount();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as "{}");

    const accountList = async () => {
      const { data: res } = await api.get(`/getAccount/${user?.id}`);
      const final = await res?.data;
      const checkFrom = final.find(
        (item: any) => item.account_name === fromAccount?.account_name
      );
      setFromAccountId(checkFrom?.id);
      const checkTo = final.find(
        (item: any) => item.account_name === toAccount
      );
      setToAccountId(checkTo?.id);
    };
    accountList();
  }, [toAccount]);

  return (
    <div className="flex items-center justify-center fixed z-20 top-0 left-0 bg-black/50 w-full h-full">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col w-screen relative md:w-1/4 py-3 px-3 bg-white dark:text-gray-700 rounded-md m-4">
        <IoIosCloseCircle
          onClick={() => setIsTransferMoney(!isTransferMoney)}
          size={30}
          className="cursor-pointer text-red-500 absolute right-2 top-2"
        />
        <h2 className="py-2 text-xl dark:text-gray-900 border-b border-gray-100 mb-2">
          Transfer Money
        </h2>

        <form onSubmit={handleTransferAccount}>
          <p className="pb-1">From Account</p>
          <input
            disabled
            type="text"
            value={fromAccount?.account_name}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
          />
          <p className="pb-1">To Account</p>
          <select
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
          >
            <option value="select">Select</option>
            {accounts.map(
              (acc, i) =>
                acc !== fromAccount?.account_name && (
                  <option key={i} value={acc}>
                    {acc}
                  </option>
                )
            )}
          </select>
          <p className="pb-1">Amount</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
          />
          <button className="flex items-center justify-center py-2 px-3 w-full bg-blue-800 rounded-md text-white dark:text-white">
            {loading ? (
              <FaSpinner className="animate-spin text-violet-600" size={24} />
            ) : (
              "Transfer Amount"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
