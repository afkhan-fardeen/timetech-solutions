'use client';
import { useState } from 'react';

export default function FloatingCurrencyButton({ onCurrencyChange, isAdmin = false }) {
  const [currency, setCurrency] = useState('BHD');
  const [isOpen, setIsOpen] = useState(false);

  const currencies = [
    { code: 'BHD', symbol: 'BD' },
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
    { code: 'SR', symbol: 'SR' },
    { code: 'OMR', symbol: 'OMR' },
    { code: 'AED', symbol: 'AED' },
    { code: 'KWD', symbol: 'KD' },
    { code: 'QAR', symbol: 'QR' },
  ];

  const handleChange = (newCurrency) => {
    if (isAdmin) return;
    setCurrency(newCurrency);
    onCurrencyChange(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        {currencies.find((c) => c.code === currency)?.symbol || 'BD'}
      </button>
      {isOpen && !isAdmin && (
        <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg p-2 w-32">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleChange(curr.code)}
              className="block w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md text-sm"
            >
              {curr.symbol} {curr.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}