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
        setConvertedValue(
          Math.round(calculated.rates[currencyTwo] * amount * 100) / 100
        ).toFixed(2);
      } catch (err) {
        console.log(`Unable to fetch curriencies: ${err}`);
      }
    }
  }

  return (
    <div className="wrapper">
      <div className="error-margin">
        {showError && "There is a problem, please try again"}
      </div>
      <form className="form-wrap card" onSubmit={(e) => doSubmit(e)}>
        <h1>Currency Converter</h1>
        <input
          className="currencyInput"
          placeholder="$0"
          onChange={(e) => setAmount(e.target.value)}
          type="text"
        />
        <div className="dropdown">
          {currencyOne !== "none" && (
            <img
              alt="Currency Flag"
              src={`https://www.countryflags.io/${currencyOne.substring(
                0,
                2
              )}/flat/64.png`}
            />
          )}
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
        </div>
        To
        <div className="dropdown">
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
        </div>
        <div className="button-wrapper">
          <input className="submitButton" type="submit" value="Convert" />
          <div className="chevron-wrap"></div>
        </div>
        <div className="resultWrap">{convertedValue}</div>
      </form>
    </div>
  );
}

export default Converter;
