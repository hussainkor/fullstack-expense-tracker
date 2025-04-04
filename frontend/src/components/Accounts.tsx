import { FaBtc, FaPaypal } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { maskAccountNumber } from "../libs";
import Title from "./Title";

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

type AccountsType = {
  data: any;
};

export default function Accounts({ data }: AccountsType) {
  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 w-full md:w-1/3">
      <div className="flex items-center justify-between">
        <Title title="Accounts" />
        <Link
          to="/accounts"
          className="text-sm text-gray-600 dark:text-gray-500 hover:text-violet-600 hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="w-full">
        {data?.map((item: any, index: number) => (
          <div
            key={index + item?.account_name?.toLowerCase()}
            className="flex items-center justify-between mt-6"
          >
            <div className="flex items-center gap-4">
              <div>{ICONS[item?.account_name?.toLowerCase()]}</div>
              <div>
                <p className="text-black dark:text-gray-400 text-base 2xl:text-lg">
                  {item?.account_name}
                </p>
                <span>{maskAccountNumber(item?.account_number)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
