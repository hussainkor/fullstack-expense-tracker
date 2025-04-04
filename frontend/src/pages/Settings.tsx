import React from "react";
import useStore from "../store";
import Title from "../components/Title";
import SettingsForm from "../components/SettingsForm";

export default function Settings() {
  const { user } = useStore((state: any) => state);
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl px-4 py-4 my-6 shadow-lg bg-gray-50 dark:bg-black/20 md:px-10 md:my-10">
        <div className="mt-6 border-b-2 border-gray-200 dark:border-gray-800">
          <Title title="General Settings" />
        </div>
        <div className="py-6">
          <p className="text-lg font-bold text-black dark:text-white">
            Profile Information
          </p>
        </div>
        <div className="flex items-center gap-4 my-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-800 dark:bg-gray-600 font-bold text-2xl text-white rounded-full cursor-pointer">
            <p>{user?.firstname?.charAt(0)}</p>
          </div>
          <p className="text-2xl font-semibold text-black dark:text-gray-400">
            {user?.firstname}
          </p>
        </div>
        <SettingsForm />
      </div>
    </div>
  );
}
