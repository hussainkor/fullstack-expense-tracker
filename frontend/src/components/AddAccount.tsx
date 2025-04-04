import React, { FormEvent, useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { GoAlertFill } from "react-icons/go";
import { generateAccountNumber } from "../libs";
import { FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import api from "../libs/apiCall";
import useStore from "../store";

type AddAccountType = {
  isAccountOpen: boolean;
  setIsAccountOpen: (type: boolean) => void;
  fetchAccount: () => void;
};

const accounts = ["Cryptos", "Paypal", "Cash", "Visa Card"];

export default function AddAccount({
  isAccountOpen,
  setIsAccountOpen,
  fetchAccount,
}: AddAccountType) {
  const [checkAccount, setCheckAccount] = useState<any>(false);
  const [accountNumber, setAccountNumber] = useState<number>();
  const [selectedAcc, setSelectedAcc] = useState("select");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCredentials } = useStore((state: any) => state);

  const handleAddAccount = async (e: FormEvent) => {
    e.preventDefault();
    const amounts = Number(amount);

    try {
      setLoading(true);
      if (amounts < 1000) {
        toast.error("Minimum amount should be 1000");
      } else if (isNaN(amounts)) {
        toast.error("Amount should be in number");
      } else {
        const newAccount = {
          name: selectedAcc,
          amount: amount,
          account_number: accountNumber,
        };
        const { data: res } = await api.post("/create/account", newAccount);
        if (res?.user) {
          const newUser = { ...res.user, token: res.token };
          localStorage.setItem("user", JSON.stringify(newUser));
          setCredentials(newUser);
          toast.success(res?.message);
          fetchAccount();
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user") as "{}");
    const isAccount = getUser?.account?.includes(selectedAcc);
    setCheckAccount(isAccount);
    const accNumber = generateAccountNumber();
    setAccountNumber(accNumber);
  }, [selectedAcc]);

  return (
    <div className="flex items-center justify-center fixed z-20 top-0 left-0 bg-black/50 w-full h-full">
      <Toaster richColors position="top-center" />
      <div className="flex flex-col w-screen relative md:w-1/4 py-3 px-3 bg-white dark:text-gray-700 rounded-md m-4">
        <IoIosCloseCircle
          onClick={() => setIsAccountOpen(!isAccountOpen)}
          size={30}
          className="cursor-pointer text-red-500 absolute right-2 top-2"
        />
        <h2 className="py-2 text-xl dark:text-gray-900 border-b border-gray-100 mb-2">
          Add Account
        </h2>
        <p className="pb-1">Select Account</p>
        <form onSubmit={handleAddAccount}>
          {selectedAcc === "select" ? (
            <select
              value={selectedAcc}
              onChange={(e) => setSelectedAcc(e.target.value)}
              className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
            >
              <option value="select">Select</option>
              {accounts.map((acc, i) => (
                <option key={i} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          ) : (
            <>
              <select
                value={selectedAcc}
                onChange={(e) => setSelectedAcc(e.target.value)}
                className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
              >
                <option value="select">Select</option>
                {accounts.map((acc, i) => (
                  <option key={i} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
              {checkAccount ? (
                <p className="text-sm py-2 px-2 mt}-3 rounded-md bg-yellow-400 pb-2 dark:text-slate-900">
                  <GoAlertFill /> Acount already created select onother one
                </p>
              ) : (
                <>
                  <p className="pb-1">Account Number</p>
                  <input
                    disabled
                    type="text"
                    value={accountNumber}
                    className="py-1 px-2 border broder-gray-400 rounded-md mb-3 w-full"
                  />
                  <p className="pb-1">Initial Amount</p>
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
                      <FaSpinner
                        className="animate-spin text-violet-600"
                        size={24}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}
