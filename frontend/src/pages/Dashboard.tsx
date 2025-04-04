import React, { useEffect, useState } from "react";
import Info from "../components/Info";
import Stats from "../components/Stats";
import Chart from "../components/Chart";
import DoughnutChart from "../components/DoughnutChart";
import LastTransactions from "../components/LastTransactions";
import Account from "../components/Accounts";
import api from "../libs/apiCall";
import { toast } from "sonner";
import Loading from "../components/Loading";

export default function Dashboard() {
  const [data, setData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = "/dashboard";
    try {
      const { data } = await api.get(URL);
      setData(data);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later"
      );
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="px-0 md:px-5 bg-white dark:bg-slate-900">
        <Info title="Dashboard" subTitle="Monitor your financial activities" />
        <Stats dt={data} />
        <div className="w-ful flex flex-col-reverse md:flex-row items-center gap-10">
          <Chart data={data?.chartData} />
          {data?.totalIncome > 0 && <DoughnutChart dt={data} />}
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
          <LastTransactions data={data?.lastTransactions} />
          {data?.lastAccount?.length > 0 && (
            <Account data={data?.lastAccount} />
          )}
        </div>
      </div>
    </>
  );
}
