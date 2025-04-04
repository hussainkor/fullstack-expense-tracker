import { nanoid } from "nanoid";

export const formatCurrency = (value: number) => {
  const user = JSON.parse(localStorage.getItem("user") as "{}");

  if (isNaN(value)) {
    return "Invalid input";
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: user?.currency || "USD",
    minimumFractionDigits: 2,
  }).format(numberValue);
};

export const maskAccountNumber = (accountNumber: string) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 12) {
    return "accountNumber";
  }

  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);
  const middleFour = accountNumber.substring(4, 8);
  const maskDigit = "*".repeat(middleFour.length);
  return `${firstFour}${maskDigit}${lastFour}`;
};
type CountryDataType = {
  currencies: string;
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
};
export const fetchCountries = async () => {
  const URL = "https://restcountries.com/v3.1/all";

  try {
    const response = await fetch(URL);
    const data: any = await response.json();

    if (response.ok) {
      const countries = data.map((country: CountryDataType) => {
        const currencies = country.currencies || {};
        const countrycode = Object.keys(currencies)[0];

        return {
          country: country?.name?.common || "",
          flag: country?.flags?.png || "",
          currency: countrycode || "",
        };
      });
      const sortedCountries = countries.sort((a: any, b: any) =>
        a.country.localeCompare(b.country)
      );
      return sortedCountries;
    } else {
      console.error(`Error: ${data?.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occured while fetching data", error);
    return [];
  }
};

export const generateAccountNumber = () => {
  const date = Date.now();
  const random = Math.trunc(Math.random() * 8);
  const random2 = Math.trunc(Math.random() * 8);
  const char = date.toString().slice(-10);
  const charNumber = Number(random2 + char + random);
  return charNumber;
};

export const getDateSevenDaysAgo = () => {
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return sevenDaysAgo.toISOString().split("T")[0];
};

export const maxDate = () => {
  const today = new Date();
  const maxD = new Date(today);
  maxD.setDate(today.getDate() - 1);
  const maxDate = maxD.toISOString().split("T")[0];
  return maxDate;
};

export const currentDate = () => {
  const today = new Date();
  const currentDate = new Date(today).toISOString().split("T")[0];
  return currentDate;
};

export const convertDate = (item: Date) => {
  const myDate = new Date(item);
  const convertDate = myDate.toDateString();
  return convertDate;
};
