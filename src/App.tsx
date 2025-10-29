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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0;
  }, [amount]);

  const handleConvert = async () => {
    if (!isValidAmount) return;
    setError(null);
    setLoading(true);
    try {
      const { total } = await convert(Number(amount), from, to);
      setTotal(total);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch rate");
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    setFrom(to);
    setTo(from);
    if (isValidAmount) {
      // Recalculate using swapped currencies
      try {
        setLoading(true);
        const { total: swapped } = await convert(Number(amount), to, from);
        setTotal(swapped);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch rate");
        setTotal(null);
      } finally {
        setLoading(false);
      }
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

        {error && (
          <p className="result" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {loading && <p className="result">Fetching latest rate…</p>}
        {total != null && !loading && !error && (
          <Result amount={Number(amount)} from={from} to={to} total={total} />
        )}

        <button
          className="btn-primary"
          onClick={handleConvert}
          disabled={!isValidAmount || loading}
        >
          {loading ? "Loading…" : "Get Exchange Rate"}
        </button>
      </div>
    </div>
  );
}

export default App;
