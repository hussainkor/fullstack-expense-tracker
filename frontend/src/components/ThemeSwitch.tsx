import React, { useEffect, useState } from "react";
import useStore from "../store";
import { IoMoonSharp } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";

export default function ThemeSwitch() {
  const { theme, setTheme } = useStore((state: any) => state);
  //const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const handleToggle = () => {
    //const newTheme = isDarkMode ? "light" : "dark";
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
    //setIsDarkMode(!isDarkMode);
    //setTheme(newTheme);
    //localStorage.setItem("theme", newTheme);
  };
  useEffect(() => {}, []);
  return (
    <div>
      <div className="cursor-pointer" onClick={handleToggle}>
        {/* {isDarkMode ? <IoIosSunny size={24} /> : <IoMoonSharp size={24} />} */}
        {theme === "light" ? (
          <IoIosSunny size={24} />
        ) : (
          <IoMoonSharp size={24} />
        )}
      </div>
    </div>
  );
}
