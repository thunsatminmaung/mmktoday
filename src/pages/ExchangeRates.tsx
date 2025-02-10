import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ExchangeRate {
  currency: string;
  code: string;
  flag: string;
  link: string;
  buy: string;
  sell: string;
}

function ExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const currencyMap = {
    'USD': { 
      name: 'US Dollar', 
      flag: 'https://flagsapi.com/US/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/usd'
    },
    'EUR': { 
      name: 'Euro', 
      flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/510px-Flag_of_Europe.svg.png',
      link: 'https://hellolinker.net/rates/exchange-price/eur'
    },
    'SGD': { 
      name: 'Singapore Dollar', 
      flag: 'https://flagsapi.com/SG/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/sgd'
    },
    'THB': { 
      name: 'Thai Baht', 
      flag: 'https://flagsapi.com/TH/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/thb'
    },
    'MYR': { 
      name: 'Malaysian Ringgit', 
      flag: 'https://flagsapi.com/MY/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/myr'
    },
    'JPY': { 
      name: 'Japanese Yen', 
      flag: 'https://flagsapi.com/JP/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/jpy'
    },
    'CNY': { 
      name: 'Chinese Yuan', 
      flag: 'https://flagsapi.com/CN/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/cny'
    },
    'WON': { 
      name: 'Korean Won', 
      flag: 'https://flagsapi.com/KR/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/won'
    },
    'GBP': { 
      name: 'British Pound', 
      flag: 'https://flagsapi.com/GB/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/gbp'
    },
    'AUD': { 
      name: 'Australian Dollar', 
      flag: 'https://flagsapi.com/AU/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/aud'
    },
    'CAD': { 
      name: 'Canadian Dollar', 
      flag: 'https://flagsapi.com/CA/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/cad'
    },
    'NTD': { 
      name: 'New Taiwan Dollar', 
      flag: 'https://flagsapi.com/TW/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/ntd'
    },
    'AED': { 
      name: 'UAE Dirham', 
      flag: 'https://flagsapi.com/AE/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/aed'
    },
    'INR': { 
      name: 'Indian Rupee', 
      flag: 'https://flagsapi.com/IN/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/inr'
    },
    'HKD': { 
      name: 'Hong Kong Dollar', 
      flag: 'https://flagsapi.com/HK/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/hkd'
    },
    'MOP': { 
      name: 'Macanese Pataca', 
      flag: 'https://flagsapi.com/MO/flat/64.png',
      link: 'https://hellolinker.net/rates/exchange-price/mop'
    }
  };

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('currency, buy_rate, sell_rate, updated_at')
        .order('currency');

      if (error) throw error;

      const formattedRates = data.map(rate => ({
        currency: currencyMap[rate.currency]?.name || rate.currency,
        code: rate.currency,
        flag: currencyMap[rate.currency]?.flag || '',
        link: currencyMap[rate.currency]?.link || '',
        buy: rate.buy_rate,
        sell: rate.sell_rate
      }));

      setRates(formattedRates);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Unable to fetch latest rates. Please try again later.');
      toast.error('Failed to fetch exchange rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Exchange Rates</h1>
            <p className="text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Currency</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Buy (MMK)</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Sell (MMK)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rates.map((rate) => (
                <tr
                  key={rate.code}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <a 
                      href={rate.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={rate.flag} 
                        alt={`${rate.currency} flag`} 
                        className="w-8 h-8 rounded-sm object-cover"
                      />
                      <div>
                        <div className="font-medium">{rate.currency}</div>
                        <div className="text-sm text-gray-500">{rate.code}</div>
                      </div>
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums">{rate.buy}</td>
                  <td className="px-6 py-4 text-right font-medium tabular-nums">{rate.sell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && rates.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExchangeRates;