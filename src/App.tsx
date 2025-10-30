import React, { useMemo, useState } from "react";
import AmountInput from "./components/AmountInput";
import CurrencySelect from "./components/CurrencySelect";
import SwapButton from "./components/SwapButton";
import Result from "./components/Result";
import { convert } from "./data/rates";

function App() {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("NPR");
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<
    { code: string; name: string; flag?: string }[]
  >([]);

  React.useEffect(() => {
    const controller = new AbortController();
    async function loadSymbols() {
      try {
        const res = await fetch("https://api.frankfurter.app/currencies", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load currencies");
        const data: Record<string, string> = await res.json();
        const list = Object.entries(data)
          .map(([code, name]) => ({
            code,
            name,
            flag: makeFlagFromCurrency(code),
          }))
          .sort((a, b) => a.code.localeCompare(b.code));
        setCurrencies(list);
        // Ensure defaults exist; if not, pick first two different
        const codes = list.map((c) => c.code);
        if (!codes.includes(from) || !codes.includes(to) || from === to) {
          setFrom(codes[0]);
          setTo(codes.find((c) => c !== codes[0]) || codes[0]);
        }
      } catch (e) {
        // keep silent; UI works but selects may be empty
      }
    }
    loadSymbols();
    return () => controller.abort();
  }, []);

  function makeFlagFromCurrency(code: string): string | undefined {
    const region = code === "EUR" ? "EU" : code.slice(0, 2);
    // Validate region
    try {
      const display = new (Intl as any).DisplayNames(undefined, {
        type: "region",
      });
      const name = display.of(region);
      if (!name || typeof name !== "string") return undefined;
    } catch {
      return undefined;
    }
    const A = 0x1f1e6;
    const flag = String.fromCodePoint(
      ...region
        .toUpperCase()
        .split("")
        .map((ch) => A + ch.charCodeAt(0) - 65)
    );
    return flag;
  }

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
            currencies={currencies}
            disabledCodes={[to]}
          />
          <SwapButton onClick={handleSwap} />
          <CurrencySelect
            id="to"
            label="To"
            value={to}
            onChange={setTo}
            currencies={currencies}
            disabledCodes={[from]}
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
