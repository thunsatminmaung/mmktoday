import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GoldPrice {
  type: string;
  price: number;
  change: number;
  unit: string;
}

function GoldPrices() {
  const [worldPrices, setWorldPrices] = useState<GoldPrice[]>([
    { type: '24 Karat', price: 2742.96, change: -2.14, unit: '1 oz' },
    { type: '22 Karat', price: 2534.57, change: -1.14, unit: '1 oz' },
    { type: '21 Karat', price: 2400.27, change: -0.14, unit: '1 oz' },
    { type: '18 Karat', price: 2087.37, change: -1.24, unit: '1 oz' }
  ]);

  const [myanmarPrices, setMyanmarPrices] = useState<GoldPrice[]>([
    { type: '16 Pae Yae', price: 6423906.08, change: -2500, unit: '1 Kyat Tha' },
    { type: '15 Pae Yae', price: 6155862.92, change: -2000, unit: '1 Kyat Tha' },
    { type: '14 Pae 2 Pae Yae', price: 5887840.89, change: -1800, unit: '1 Kyat Tha' },
    { type: '14 Pae Yae', price: 5620219.64, change: -1500, unit: '1 Kyat Tha' },
    { type: '13 Pae Yae', price: 5152588.40, change: -1200, unit: '1 Kyat Tha' },
    { type: '12 Pae 2 Pae Yae', price: 4817333.26, change: -1000, unit: '1 Kyat Tha' },
    { type: '11 Pae Yae', price: 4282070.72, change: -800, unit: '1 Kyat Tha' },
    { type: '9 Pae Yae', price: 3746805.52, change: -600, unit: '1 Kyat Tha' }
  ]);

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const chartData = {
    labels: ['7 Days Ago', '6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Today'],
    datasets: [
      {
        label: '16 Pae Yae Price',
        data: [6420000, 6421000, 6422000, 6423000, 6423500, 6423700, 6423906.08],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: '7-Day Price Trend (16 Pae Yae)'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: number) => `${value.toLocaleString()} MMK`
        }
      }
    }
  };

  const refreshPrices = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const PriceTable = ({ prices, title }: { prices: GoldPrice[], title: string }) => (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Unit</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Price</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">24h Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {prices.map((price) => (
            <tr
              key={price.type}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="font-medium">{price.type}</div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="font-medium">{price.unit}</div>
              </td>
              <td className="px-6 py-4 text-right font-medium">
                {price.price.toLocaleString()}
              </td>
              <td className={`px-6 py-4 text-right font-medium ${
                price.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {price.change >= 0 ? '+' : ''}{price.change.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gold Prices</h1>
            <p className="text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={refreshPrices}
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="space-y-8">
          <PriceTable prices={worldPrices} title="World Gold Prices" />
          <PriceTable prices={myanmarPrices} title="Myanmar Gold Prices" />
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-6">Price Trend</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default GoldPrices;