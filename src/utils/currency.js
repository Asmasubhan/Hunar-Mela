// src/utils/currency.js
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85,
  PKR: 278.50,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35
};

export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  // Convert to USD first, then to target currency
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  return usdAmount * EXCHANGE_RATES[toCurrency];
};

export const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getExchangeRate = (fromCurrency, toCurrency) => {
  return EXCHANGE_RATES[toCurrency] / EXCHANGE_RATES[fromCurrency];
};