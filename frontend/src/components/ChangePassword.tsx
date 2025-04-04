import React, { FormEvent, useState } from "react";
import { toast, Toaster } from "sonner";
import { IoIosCloseCircle } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

import api from "../libs/apiCall";

type ModalType = {
  isModal: boolean;
  setIsModal: (type: boolean) => void;
};

export default function ChangePassword({ isModal, setIsModal }: ModalType) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resetInput = () => {
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordChange = async (e: FormEvent) => {
    setIsLoading(true);
    try {
      e.preventDefault();

      if (!(password || newPassword || confirmPassword)) {
        toast.error("Enter all the fields");
      } else {
        const setNewPassword = {
          currentPassword: password,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword,
        };
        //const { data: res } = await api.put("/changePassword", setNewPassword);
        await api.put("/changePassword", setNewPassword);
        toast.success("Password changed cussessfully");
        resetInput();
        setIsModal(!isModal);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed z-20 top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
      <Toaster richColors position="top-center" />
      <div className="w-1/3 bg-slate-900 py-5 px-8 dark:bg-slate-200 rounded-md relative">
        <IoIosCloseCircle
          onClick={() => setIsModal(!isModal)}
          className="absolute top-3 right-3 size-8 cursor-pointer text-red-400 dark:text-red-600"
        />
        <h2 className="text-white text-2xl dark:text-slate-900 text-center">
          Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="flex flex-col mt-5">
          <input
            className="mb-3 text-black dark:text-white py-2 px-4 rounded-md bg-white dark:bg-slate-800"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Old Password"
          />
          <input
            className="mb-3 text-black dark:text-white py-2 px-4 rounded-md bg-white dark:bg-slate-800"
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="mb-3 text-black dark:text-white py-2 px-4 rounded-md bg-white dark:bg-slate-800"
            type="password"
            placeholder="Enter New Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            disabled={isLoading && true}
            className="flex items-center justify-center px-4 py-2 text-white text-center bg-blue-900 rounded-md"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-violet-600" size={24} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
