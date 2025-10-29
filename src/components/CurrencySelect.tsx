import React from "react";
import type { Currency, CurrencyCode } from "../data/currencies";

type Props = {
  label: string;
  value: CurrencyCode;
  onChange: (code: CurrencyCode) => void;
  currencies: Currency[];
  id: string;
};

export default function CurrencySelect({
  label,
  value,
  onChange,
  currencies,
  id,
}: Props) {
  return (
    <div className="select-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
    </div>
  );
}
