import React, { useEffect, useState } from "react";
import api from "../libs/apiCall";
import useStore from "../store";
import Loading from "../components/Loading";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import { FaBtc, FaPaypal } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { maskAccountNumber } from "../libs";
import AddAccount from "../components/AddAccount";
import AddAmount from "../components/AddAmount";
import TransferMoney from "../components/TransferMoney";

const ICONS: { [key: string]: any } = {
  cryptos: (
    <div className="w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full">
      <FaBtc size={26} />
    </div>
  ),
  "visa card": (
    <div className="w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full">
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full">
      <GiCash size={26} />
    </div>
  ),
  paypal: (
    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full">
      <FaPaypal size={26} />
    </div>
  ),
};

export default function AccountDetails() {
  const { user } = useStore((state: any) => state);
  const [accountList, setAccountList] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddAmount, setIsAddAmount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>();
  const [isTransferMoney, setIsTransferMoney] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [fromAccount, setFromAccount] = useState<any>({});

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
    setIsLoading(true);
    fetchAccount();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isAccountOpen && (
        <AddAccount
          isAccountOpen={isAccountOpen}
          setIsAccountOpen={setIsAccountOpen}
          fetchAccount={fetchAccount}
        />
      )}
      {isAddAmount && (
        <AddAmount
          isAddAmount={isAddAmount}
          setIsAddAmount={setIsAddAmount}
          fetchAccount={fetchAccount}
          selectedAccount={selectedAccount}
        />
      )}
      {isTransferMoney && (
        <TransferMoney
          isTransferMoney={isTransferMoney}
          setIsTransferMoney={setIsTransferMoney}
          fromAccount={fromAccount}
          fetchAccount={fetchAccount}
        />
      )}
      <div className="w-full py-10">
        <div className="flex items-center justify-between">
          <Title title="Accounts Information" />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAccountOpen(true)}
              className="py-2 px-3 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center"
            >
              <IoMdAdd size={22} />
              <span className="">Add</span>
            </button>
          </div>
        </div>
        {accountList.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6">
            {accountList?.map((item: any, index: number) => (
              <div
                key={index}
                className="w-full flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow relative"
              >
                <div
                  className="absolute top-1 right-1 z-10"
                  onMouseOver={() => {
                    setIsDropdown(true);
                  }}
                  onMouseEnter={() => setSelectedAccount(item.id)}
                  onMouseLeave={() => (
                    setIsDropdown(false), setSelectedAccount(null)
                  )}
                >
                  <HiOutlineDotsVertical
                    className="absolute right-1 top-3 cursor-pointer"
                    size={22}
                  />
                  {selectedAccount === item.id && (
                    <div className="p-3 w-36 bg-white leading-8 text-gray-700 shadow rounded-md absolute right-3 top-8">
                      <button
                        onClick={() => (
                          setIsTransferMoney(true), setFromAccount(item)
                        )}
                      >
                        Transfer Money
                      </button>
                      <button
                        onClick={() => (
                          setSelectedAccount(item.id), setIsAddAmount(true)
                        )}
                      >
                        Add Money
                      </button>
                    </div>
                  )}
                </div>

                <div>{ICONS[item?.account_name.toLowerCase()]}</div>
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-black dark:text-white text-2xl font-bold">
                        {item?.account_name}
                      </p>
                      <IoShieldCheckmarkSharp
                        size={26}
                        className="ml-1 text-emerald-600"
                      />
                    </div>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-light leading-loose">
                    {maskAccountNumber(item?.account_number)}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-500">
                    {new Date(item?.createdat).toLocaleDateString("en-US", {
                      dateStyle: "full",
                    })}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                      {user?.currency} {item?.account_balance}
                    </p>
                    <button
                      onClick={() => (
                        setSelectedAccount(item.id), setIsAddAmount(true)
                      )}
                      className="text-sm outline-none text-violet-600 hover:underline"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
            <span>No account found</span>
          </div>
        )}
      </div>
    </>
  );
}
