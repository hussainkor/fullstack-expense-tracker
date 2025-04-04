import React, { useState } from "react";
import usericon from "../assets/images/user-icon.png";
import { IoIosArrowDown } from "react-icons/io";
import useStore from "../store/index";
import ChangePassword from "./ChangePassword";
import { Link } from "react-router-dom";

export default function UserDropDown() {
  const setCredentials = useStore((state: any) => state.user);
  const { singOut } = useStore((state: any) => state);
  const [dropdown, setDropdown] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const handleLogout = () => {
    singOut({ user: null });
    localStorage.setItem("user", "null");
  };
  return (
    <>
      {isModal && <ChangePassword isModal={isModal} setIsModal={setIsModal} />}
      <div
        className="flex gap-2 items-center relative cursor-pointer"
        onMouseOver={() => setDropdown(true)}
        onMouseLeave={() => setDropdown(false)}
      >
        <span className="profile-text bg-slate-900 dark:bg-white text-white dark:text-slate-900">
          {setCredentials?.firstname?.slice(0, 1)}
        </span>
        <IoIosArrowDown />
        {dropdown && (
          <div className="flex flex-col text-left w-48 absolute z-20 top-9 right-0 text-sm py-3 px-3 bg-white drop-shadow-lg dark:bg-black rounded-md leading-8">
            <div className="flex gap-3 mb-5">
              <img src={usericon} alt="user" className="w-12" />
              <div>
                <h3 className="text-md">{setCredentials?.firstname}</h3>
                <p className="text-sm text-gray-600">{setCredentials?.email}</p>
              </div>
            </div>
            <Link to="/settings">Profile</Link>
            <span onClick={() => setIsModal(true)}>Change Password</span>
            <span
              onClick={handleLogout}
              className="bg-red-200 text-red-900 rounded-md pl-3"
            >
              Logout
            </span>
          </div>
        )}
      </div>
    </>
  );
}
