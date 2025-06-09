'use client';
import { useState } from 'react';

export default function FloatingCurrencyButton({ onCurrencyChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const currencies = ['BHD', 'USD', 'EUR'];

  const handleCurrencySelect = (currency) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-apple-black text-white p-3 rounded-full shadow-lg hover:bg-apple-blue transition-all"
      >
        {isOpen ? 'Close' : 'Currency'}
      </button>
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg p-4">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => handleCurrencySelect(currency)}
              className="block w-full text-left px-4 py-2 text-apple-black hover:bg-apple-light"
            >
              {currency}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}