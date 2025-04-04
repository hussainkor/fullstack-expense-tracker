import { FormEvent, useEffect, useState } from "react";
import useStore from "../store";
import Country from "./Country";
import { FaSpinner } from "react-icons/fa";

import api from "../libs/apiCall";
import { toast } from "sonner";

export default function SettingsForm() {
  const { user, theme, setTheme, setCredentials } = useStore(
    (state: any) => state
  );

  const [defaultTheme, setDefaultTheme] = useState(theme);

  const [countriesData, setCountriesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState(user?.firstname);
  const [lastname, setLastname] = useState(user?.lastname);
  const [currencies, setCurrencies] = useState(user?.currency);
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState(user.contact);
  const [isCountry, setIsCountry] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!(firstname || lastname || contact || currencies || country)) return;
    setIsLoading(true);
    try {
      const updateUser = {
        email: user?.email,
        firstname: firstname,
        lastname: lastname,
        contact: contact,
        currency: currencies,
        country: country,
      };

      const { data: res } = await api.put("/updateUser", updateUser);
      if (res?.user) {
        const newUser = { ...res.user, token: res.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        setCredentials(newUser);
        toast.success(res?.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
    setIsCountry(false);
  };

  const toggleTheme = (val: string) => {
    setTheme(val);
    localStorage.setItem("theme", val);
  };
  useEffect(() => {}, []);
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <label className="">Firstname</label>
          <input
            name="firstname"
            placeholder="John"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
        <div className="w-full">
          <label>Lastname</label>
          <input
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Doe"
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <label className="">Email</label>
          <input
            disabled
            name="Email"
            value={user?.email}
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
        <div className="w-full">
          <label>Phone</label>
          <input
            name="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone Number"
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full">
          <label className="">Country</label>
          {!isCountry ? (
            <input
              onMouseDown={() => setIsCountry(true)}
              name="Country"
              value={user?.country}
              placeholder="Country"
              className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
            />
          ) : (
            <Country
              countriesData={countriesData}
              setCountriesData={setCountriesData}
              setCurrencies={setCurrencies}
              setCountry={setCountry}
            />
          )}
        </div>
        <div className="w-full">
          <label>Currency</label>
          <input
            disabled
            name="currency"
            value={user?.currency}
            placeholder="Currency"
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-between pt-6 gap-5">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Appearance
          </p>
          <span className="text-sm">
            Customize how your theme looks on your device
          </span>
        </div>
        <div className="w-28 md:w-40">
          <select
            className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none"
            defaultValue={defaultTheme}
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <div className="w-full flex items-center justify-between pt-6 gap-5">
        <div className="">
          <p className="text-lg text-black dark:text-gray-400 font-semibold">
            Language
          </p>
          <span className="text-sm">
            Customize what language you want to use
          </span>
        </div>
        <div className="w-28 md:w-40">
          <select className="w-full mt-2 py-2 px-3 text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none">
            <option value="English">English</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-end pt-5 pb-10 border-b-2 border-gray-200 dark:border-gray-800 gap-4">
        <button
          type="reset"
          className="px-6 bg-transparent rounded-md py-2 text-black dark:text-white border border-gray-200 dark:border-gray-700"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-8 bg-violet-800 rounded-md py-2 text-white dark:text-white border border-gray-200 dark:border-gray-700"
        >
          {isLoading ? (
            <FaSpinner className="animate-spin text-violet-600" size={28} />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}
