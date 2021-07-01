import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.scss";

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
    if (currencyOne === "none" || currencyTwo === "none" || amount === "")
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
    <div className="wrapper">
      {showError && "There was an error, please try again."}
      <form className="form-wrap card" onSubmit={(e) => doSubmit(e)}>
        <h1>Currency Converter</h1>
        <select
          className="currencySelect"
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
        <input onChange={(e) => setAmount(e.target.value)} type="text" />
        {currencyOne !== "none" && (
          <img
            alt="Currency Flag"
            src={`https://www.countryflags.io/${currencyOne.substring(
              0,
              2
            )}/flat/64.png`}
          />
        )}

        {currencyTwo !== "none" && (
          <img
            alt="Currency Flag"
            src={`https://www.countryflags.io/${currencyTwo.substring(
              0,
              2
            )}/flat/64.png`}
          />
        )}
        <select
          className="currencySelect"
          onChange={(val) => setCurrencyTwo(val.target.value)}
        >
          <option value="none">Select a currency</option>
          {Object.keys(countryList).length > 0 &&
            Object.keys(countryList).map((country, key) => (
              <option
                value={country}
              >{`${country} - ${countryList[country]}`}</option>
            ))}
        </select>
        <div className="button-wrapper">
          <input className="submitButton" type="submit" value="Convert" />
          <div className="chevron-wrap"></div>
        </div>
      </form>
      {convertedValue}
    </div>
  );
}

export default Converter;
