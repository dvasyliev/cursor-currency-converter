import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AmountInput({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="amount">Enter Amount</label>
      <input
        id="amount"
        type="number"
        inputMode="decimal"
        min={0}
        step={0.01}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        placeholder="1"
      />
    </div>
  );
}
