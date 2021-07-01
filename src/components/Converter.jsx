import React, { useState, useEffect } from "react";
import axios from "axios";

function Converter() {
  const [currencyOne, setCurrencyOne] = useState("none");
  const [currencyTwo, setCurrencyTwo] = useState("none");
  const [amount, setAmount] = useState("");
  const [convertedValue, setConvertedValue] = useState("0.00");
  const [countryList, setCountryList] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getCountriesData();
  }, []);

  async function getCountriesData() {
    try {
      const response = await axios.get(
        "https://openexchangerates.org/api/currencies.json"
      );
      const flags = await response.data;
      setCountryList(flags);
      return flags;
    } catch (err) {
      console.log(`Unable to fetch currencies: ${err}`);
    }
  }

  async function doSubmit(e) {
    e.preventDefault();
    setShowError(false);
    if (currencyOne == "none" || currencyTwo == "none" || amount == "")
      setShowError(true);
    else {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/" + currencyOne
        );
        const calculated = await response.data;
        console.log(calculated);
        setConvertedValue(calculated.rates[currencyTwo] * amount);
      } catch (err) {
        console.log(`Unable to fetch curriencies: ${err}`);
      }
    }
  }

  return (
    <div>
      {showError && "Error"}
      <form onSubmit={(e) => doSubmit(e)}>
        <input onChange={(e) => setAmount(e.target.value)} type="text" />
        {currencyOne != "none" && (
          <img
            src={`https://www.countryflags.io/${currencyOne.substring(
              0,
              2
            )}/flat/64.png`}
          />
        )}
        <select
          data-testid="currencyOne"
          onChange={(val) => setCurrencyOne(val.target.value)}
        >
          <option value="none">Select a currency</option>
          {Object.keys(countryList).length > 0 &&
            Object.keys(countryList).map((country, key) => (
              <option
                data-testid="currencyOneOption"
                value={country}
              >{`${country} - ${countryList[country]}`}</option>
            ))}
        </select>
        {currencyTwo != "none" && (
          <img
            src={`https://www.countryflags.io/${currencyTwo.substring(
              0,
              2
            )}/flat/64.png`}
          />
        )}
        <select onChange={(val) => setCurrencyTwo(val.target.value)}>
          <option value="none">Select a currency</option>
          {Object.keys(countryList).length > 0 &&
            Object.keys(countryList).map((country, key) => (
              <option
                value={country}
              >{`${country} - ${countryList[country]}`}</option>
            ))}
        </select>
        <input type="submit" value="Convert" />
      </form>
      {convertedValue}
    </div>
  );
}

export default Converter;
