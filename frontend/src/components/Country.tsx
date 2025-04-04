import { useState, useEffect } from "react";
import ReactCountryFlagsSelect from "react-country-flags-select";
import { fetchCountries } from "../libs/index";

type CountriesType = {
  setCountriesData: any;
  countriesData: any;
  setCurrencies: any;
  setCountry: any;
};

export default function Country({
  setCountriesData,
  countriesData,
  setCurrencies,
  setCountry,
}: CountriesType) {
  const [selected, setSelected] = useState<any>(null);

  const getCountriesList = async () => {
    const data = await fetchCountries();
    setCountriesData(data);
  };

  useEffect(() => {
    getCountriesList();
    const result = countriesData.find(
      (item: any) => item?.country === selected?.label
    );
    setCurrencies(result?.currency);
    setCountry(result?.country);
  }, [selected, setCurrencies, setCountry]);
  return (
    <div className="w-full border border-gray-200 py-1 px-3 mt-2 bg-white dark:bg-transparent dark:border-gray-800 dark:text-gary-400">
      <ReactCountryFlagsSelect
        selected={selected}
        onSelect={setSelected}
        fullWidth
      />
    </div>
  );
}
