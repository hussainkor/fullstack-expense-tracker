import { useEffect, useState } from "react";
import { maxDate, currentDate } from "../libs";
import { toast, Toaster } from "sonner";

type DateRangeType = {
  startDate: string | number;
  setStartDate: (type: string) => void;
  endDate: string | number;
  setEndDate: (type: string) => void;
  fetchTransaction: () => void;
};

export default function DateRange({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  fetchTransaction,
}: DateRangeType) {
  useEffect(() => {
    fetchTransaction();
    if (endDate < startDate) {
      toast.error("End date should not be less than start date");
    }
  }, [startDate, endDate]);

  return (
    <div className="flex items-center gap-2">
      <Toaster richColors position="top-center" />
      <div className="flex items-center gap-1">
        <label
          className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
          htmlFor="dateFrom"
        >
          From
        </label>
        <input
          className="py-1.5 px-2 rounded dark:bg-gray-500"
          type="date"
          value={startDate}
          max={maxDate()}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <label
          className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
          htmlFor="dateTo"
        >
          To
        </label>
        <input
          className="py-1.5 px-2 rounded dark:bg-gray-500"
          type="date"
          value={endDate}
          max={currentDate()}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  );
}
