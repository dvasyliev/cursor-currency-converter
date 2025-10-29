import React, { useMemo, useState } from "react";
import AmountInput from "./components/AmountInput";
import CurrencySelect from "./components/CurrencySelect";
import SwapButton from "./components/SwapButton";
import Result from "./components/Result";
import { CURRENCIES, type CurrencyCode } from "./data/currencies";
import { convert } from "./data/rates";

function App() {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("NPR");
  const [total, setTotal] = useState<number | null>(null);

  const isValidAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0;
  }, [amount]);

  const handleConvert = () => {
    if (!isValidAmount) return;
    const { total } = convert(Number(amount), from, to);
    setTotal(total);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    if (total != null && isValidAmount) {
      const { total: swapped } = convert(Number(amount), to, from);
      setTotal(swapped);
    }
  };

  return (
    <div className="app-root">
      <div className="card">
        <h1>Currency Converter</h1>

        <AmountInput value={amount} onChange={setAmount} />

        <div className="row">
          <CurrencySelect
            id="from"
            label="From"
            value={from}
            onChange={setFrom}
            currencies={CURRENCIES}
          />
          <SwapButton onClick={handleSwap} />
          <CurrencySelect
            id="to"
            label="To"
            value={to}
            onChange={setTo}
            currencies={CURRENCIES}
          />
        </div>

        {total != null && (
          <Result amount={Number(amount)} from={from} to={to} total={total} />
        )}

        <button
          className="btn-primary"
          onClick={handleConvert}
          disabled={!isValidAmount}
        >
          Get Exchange Rate
        </button>
      </div>
    </div>
  );
}

export default App;
