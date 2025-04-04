import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import { navigation } from "../libs/navigation";
import { NavLink, useLocation } from "react-router-dom";
import { FaMoneyBills } from "react-icons/fa6";
import UserDropDown from "./UserDropDown";
import { IoMenu } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  return (
    <div className="flex items-center justify-between py-6">
      {isMobile && (
        <div className="trans-bg" onClick={() => setIsMobile(false)}></div>
      )}
      <div className="flex gap-4 items-center">
        <FaMoneyBills size={30} />
        <h2 className="text-3xl">Finance</h2>
      </div>
      <ul className={`flex gap-4 menu ${isMobile && "nav-open"}`}>
        {navigation.map((nav, i) => (
          <li key={i}>
            <NavLink
              className={`${
                location.pathname === nav.link
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : ""
              } py-2 px-4 rounded-full`}
              to={nav.link}
              onClick={() => setIsMobile(false)}
            >
              {nav.title}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex gap-10 items-center">
        <ThemeSwitch />
        <UserDropDown />
        <div className="mob">
          {isMobile ? (
            <IoCloseSharp
              size={24}
              className="cursor-pointer"
              onClick={() => setIsMobile(false)}
            />
          ) : (
            <IoMenu
              size={24}
              className="cursor-pointer"
              onClick={() => setIsMobile(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
