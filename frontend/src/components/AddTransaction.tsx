import React, { FormEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import useStore from "../store";
import api from "../libs/apiCall";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

type AddTransactionProp = {
  setIsOpen: (type: boolean) => void;
  fetchTransaction: () => void;
};

type AddTrans = {
  id: number;
  account_balance: number;
  account_name: string;
};

export default function AddTransaction({
  setIsOpen,
  fetchTransaction,
}: AddTransactionProp) {
  const [accountList, setAccountList] = useState<AddTrans[]>([]);
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useStore((state: any) => state);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amounts = Number(amount);

    const accounId = accountList.find((item) => item.account_name === source);

    try {
      setIsLoading(true);
      if (amounts < 100) {
        toast.error("Minimum amount should be 100");
      } else if (isNaN(amounts)) {
        toast.error("Amount should be in number");
      } else {
        const newTransaction = {
          source: source,
          amount: amount,
          description: description,
        };

        const { data: res } = await api.post(
          `/addTransaction/${accounId?.id}`,
          newTransaction
        );
        setIsOpen(false);
        toast.success(res?.message);
        fetchTransaction();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccount = async () => {
    try {
      const { data: res } = await api.get(`/getAccount/${user?.id}`);

      setAccountList(res?.data);
    } catch (error: any) {
      console.error(error?.response?.data?.message);
      if (error?.response?.data?.message === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);
  return (
    <div className="flex items-center justify-center fixed z-20 top-0 left-0 bg-black/50 w-full h-full">
      <div className="flex flex-col w-screen relative md:w-1/4 py-3 px-3 bg-white dark:text-gray-700 rounded-md m-4">
        <IoIosCloseCircle
          size={30}
          className="cursor-pointer text-red-500 absolute right-2 top-2"
          onClick={() => setIsOpen(false)}
        />
        <h2 className="py-2 text-xl dark:text-gray-900 border-b border-gray-100 mb-2">
          Add Transaction
        </h2>
        <form onSubmit={handleSubmit}>
          <p className="pb-1">Select Account</p>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
          >
            <option value="select">Select</option>
            {accountList.map((acc) => (
              <option key={acc?.id} value={acc?.account_name}>
                {acc?.account_name} ({user?.currency} {acc?.account_balance})
              </option>
            ))}
          </select>
          <p className="pb-1">Amount</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
            placeholder="Enter amount"
            required
          />
          <p className="pb-1">Description</p>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Description"
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
          />
          <button className="flex items-center justify-center py-2 px-3 w-full bg-blue-800 rounded-md text-white dark:text-white">
            {isLoading ? (
              <FaSpinner className="animate-spin text-violet-600" size={24} />
            ) : (
              "Add Transaction"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
