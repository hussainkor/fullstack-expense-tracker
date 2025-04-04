import React, { FormEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import api from "../libs/apiCall";
import useStore from "../store";

type AddAccountType = {
  isAddAmount: boolean;
  setIsAddAmount: (type: boolean) => void;
  fetchAccount: () => void;
  selectedAccount: (type: number | undefined) => void;
};

export default function AddAmount({
  isAddAmount,
  setIsAddAmount,
  fetchAccount,
  selectedAccount,
}: AddAccountType) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAmountt = async (e: FormEvent) => {
    e.preventDefault();
    const amounts = Number(amount);

    try {
      setLoading(true);
      if (amounts < 100) {
        toast.error("Minimum amount should be 100");
      } else if (isNaN(amounts)) {
        toast.error("Amount should be in number");
      } else {
        const { data: res } = await api.post(`/add/money/${selectedAccount}`, {
          amount: amounts,
        });
        toast.success(res?.message);
        fetchAccount();
        setIsAddAmount(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center z-20 fixed top-0 left-0 bg-black/50 w-full h-full">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col w-screen relative md:w-1/4 py-3 px-3 bg-white dark:text-gray-700 rounded-md m-4">
        <IoIosCloseCircle
          onClick={() => setIsAddAmount(!isAddAmount)}
          size={30}
          className="cursor-pointer text-red-500 absolute right-2 top-2"
        />
        <h2 className="py-2 text-xl dark:text-gray-900 border-b border-gray-100 mb-2">
          Add Amount
        </h2>

        <form onSubmit={handleAddAmountt}>
          <p className="pb-1">Enter Amount</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
            placeholder="Enter amount"
            required
          />
          <button className="flex items-center justify-center py-2 px-3 w-full bg-blue-800 rounded-md text-white dark:text-white">
            {loading ? (
              <FaSpinner className="animate-spin text-violet-600" size={24} />
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
