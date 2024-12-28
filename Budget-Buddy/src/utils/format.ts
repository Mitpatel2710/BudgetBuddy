import { useCurrency } from '../contexts/CurrencyContext';

export function useFormatMoney() {
  const { currency } = useCurrency();

  return (amount: number) => {
    return `${currency.symbol}${Math.abs(amount).toFixed(2)}`;
  };
}