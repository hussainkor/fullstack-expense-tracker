import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 bg-black/80 w-full h-full flex items-center justify-center py-2">
      <FaSpinner className="animate-spin text-violet-600" size={28} />
    </div>
  );
}
