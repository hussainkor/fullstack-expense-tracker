import React, { FormEvent, useEffect, useState } from "react";
import api from "../libs/apiCall";
import { toast } from "sonner";
import Loading from "../components/Loading";
import DateRange from "../components/DateRange";
import Title from "../components/Title";
import { IoMdAdd } from "react-icons/io";
import { CiExport } from "react-icons/ci";
import { exportToExcel } from "react-json-to-excel";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { formatCurrency, maxDate, currentDate } from "../libs";
import TransactionDetails from "../components/TransactionDetails";
import AddTransaction from "../components/AddTransaction";

type TransactionDetailsType = {
  source: string;
  description: string;
  createdat: Date;
  amount: number;
  type: string;
};

export default function Transactions() {
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<TransactionDetailsType | any>({});

  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState<string | number>(maxDate());
  const [endDate, setEndDate] = useState<string | number>(currentDate());

  const handleViewTransaction = (el: any) => {
    setSelected(el);
    setIsOpenView(true);
    console.log(selected);
  };

  const fetchTransaction = async () => {
    try {
      const URL = `/getTransactions?df=${startDate}&dt=${endDate}&s=${search}`;
      //const URL = `/getTransactions?df=2025-03-24&dt=2025-05-24&s=${search}`;
      const { data: res } = await api.get(URL);
      const filteredData = res?.data?.filter(
        (item: any) => item.type === dataType
      );
      if (filteredData.length) {
        setData(filteredData);
      } else {
        setData(res?.data);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later"
      );
      if (error?.response?.data?.message === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    await fetchTransaction();
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTransaction();
  }, [dataType]);

  if (isLoading) return <Loading />;
  return (
    <>
      {isOpenView && (
        <TransactionDetails setIsOpenView={setIsOpenView} selected={selected} />
      )}
      {isOpen && (
        <AddTransaction
          setIsOpen={setIsOpen}
          fetchTransaction={fetchTransaction}
        />
      )}
      <div className="w-full py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <Title title="Transactions Activity" />

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="py-1.5 px-2 rounded text-white bg-black dark:bg-violet-800 flex items-center justify-center gap-2"
            >
              <IoMdAdd size={22} />
              <span>Pay</span>
            </button>
            <button
              onClick={() =>
                exportToExcel(data, `Transactions ${startDate}-${endDate}`)
              }
              className="flex items-center gap-2 text-black dark:text-gray-300 border border-slate-500 rounded p-1"
            >
              Export <CiExport size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="py-1.5 px-2 border broder-gray-400 rounded-md mb-3 w-full md:w-1/3 dark:bg-gray-700"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <DateRange
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              fetchTransaction={fetchTransaction}
            />
            <form onSubmit={(e) => handleSearch(e)}>
              <div className="w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search now..."
                  className="outline-none group bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-600"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          {data?.length === 0 ? (
            <div className="w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg">
              <span>No transaction history</span>
            </div>
          ) : (
            <table className="w-full">
              <thead className="w-full border-b border-gray-300 dark:border-gray-700">
                <tr className="w-full text-left text-black dark:text-gray-400">
                  <th className="py-2">Date</th>
                  <th className="px-2 py-2">Description</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Source</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item: any) => (
                  <tr
                    key={item.id}
                    className="text-sm text-gray-600 border-gray-200 dark:border-gray-700 dark:text-gray-500"
                  >
                    <td className="py-4">
                      {new Date(item.createdat).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-col">
                        <p className="text-base font-medium text-black 2xl:text-lg dark:text-gray-400 line-clamp-1">
                          {item?.description}
                        </p>
                      </div>
                    </td>
                    <td className="flex items-center gap-2 px-2 py-3">
                      {item?.status === "Pending" && (
                        <RiProgress3Line className="text-amber-600" size={24} />
                      )}
                      {item?.status === "Completed" && (
                        <IoCheckmarkDoneCircle
                          className="text-emerald-600"
                          size={24}
                        />
                      )}
                      {item?.status === "Rejected" && (
                        <TiWarning className="text-red-600" size={24} />
                      )}
                      <span>{item?.status}</span>
                    </td>
                    <td className="px-2 py-3">
                      <p className="line-clamp-1">{item?.source}</p>
                    </td>
                    <td className="flex items-center px-2 py-4 font-medium text-black dark:text-gray-400">
                      <span
                        className={`${
                          item?.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {item?.type === "income" ? "+" : "-"}
                        {formatCurrency(item?.amount)}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewTransaction(item)}
                        className="bg-blue-700 dark:bg-gray-200 text-white dark:text-gray-900 rounded px-2 py-1"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
