import React, { useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (
      inputValue === "" ||
      (/^\d+$/.test(inputValue) && inputValue.length <= 8)
    ) {
      setValue(inputValue);

      if (inputValue.length === 8) {
        const id = calculateIsraeliIdChecksum(inputValue);
        handleResult(id);
      } else {
        handleResult("");
      }
    }
    copied && setCopied(false);
  };

  const handleResult = (e) => {
    setResult(e);
  };

  const handleReset = () => {
    setValue("");
    setResult("");
    setCopied(false);
  };

  const handleRandom = () => {
    const random8DigitNumber = Math.floor(Math.random() * 90000000) + 10000000;
    const randomValue = random8DigitNumber + "";
    setValue(randomValue);
    const id = calculateIsraeliIdChecksum(randomValue);
    setResult(id);
    setCopied(false);
  };

  const handleCopyValueResult = () => {
    if (inputRef.current) {
      const valueResult = `${value}${result}`;
      inputRef.current.value = valueResult;
      inputRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      // Clear the selection
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
      // Reset the input's value to what it was before
      inputRef.current.value = `${value}${result}`;
    }
  };

  function roundUpToNearestTen(number) {
    return Math.ceil(number / 10) * 10;
  }

  function calculateIsraeliIdChecksum(id) {
    const weights = [1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      let digit = parseInt(id[i], 10); // Convert the character to a number
      let temp = digit * weights[i];

      if (temp >= 10) {
        temp = Math.floor(temp / 10) + (temp % 10);
      }

      sum += temp;
    }
    const roundedNumber = roundUpToNearestTen(sum);
    return roundedNumber - sum;
  }

  return (
    <div className="container">
      <Header />
      {!value && <Main />}
      <div className="input-container">
        <Input
          placeHolder="123..."
          value={value}
          onChange={handleInputChange}
          isLastInput={false}
        />
        <input
          ref={inputRef}
          id="valueResultInput"
          value={result}
          readOnly
          onClick={handleCopyValueResult}
        />
        {result !== "" && (
          <Button
            className="copy-button"
            text="✂"
            onClick={handleCopyValueResult}
          />
        )}
      </div>
      <div className="button-container">
        <Button className="reset-button" text="Reset" onClick={handleReset} />
        <Button
          className="random-button"
          text="Random Number"
          onClick={handleRandom}
        />
      </div>
      {copied && <div>Copied to clipboard!</div>}
    </div>
  );
}

function Header() {
  return <div className="header">ID Calculator</div>;
}

function Main() {
  return (
    <div>
      <p>Please enter 8 valid digits</p>
    </div>
  );
}

function Input({ value, onChange, isLastInput, placeHolder }) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={isLastInput}
        placeholder={placeHolder}
      />
    </div>
  );
}

function Button({ text, onClick, className }) {
  return (
    <div>
      <button className={className} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
