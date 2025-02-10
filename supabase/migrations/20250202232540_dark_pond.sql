/*
  # Create Exchange Rates and Gold Prices Tables

  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key)
      - `currency` (text, unique)
      - `buy_rate` (text)
      - `sell_rate` (text)
      - `updated_at` (timestamp)
    
    - `gold_prices`
      - `id` (uuid, primary key)
      - `type` (text, unique)
      - `price` (numeric)
      - `change` (numeric)
      - `category` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin to manage rates
    - Add policies for public to read rates
*/

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency text UNIQUE NOT NULL,
  buy_rate text NOT NULL,
  sell_rate text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create gold_prices table
CREATE TABLE IF NOT EXISTS gold_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text UNIQUE NOT NULL,
  price numeric NOT NULL,
  change numeric NOT NULL,
  category text NOT NULL CHECK (category IN ('world', 'myanmar')),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

-- Policies for exchange_rates
CREATE POLICY "Anyone can read exchange rates"
  ON exchange_rates
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin can manage exchange rates"
  ON exchange_rates
  USING (auth.jwt() ->> 'email' = 'admin@mmktoday.com');

-- Policies for gold_prices
CREATE POLICY "Anyone can read gold prices"
  ON gold_prices
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Admin can manage gold prices"
  ON gold_prices
  USING (auth.jwt() ->> 'email' = 'admin@mmktoday.com');

-- Insert initial data for exchange rates
INSERT INTO exchange_rates (currency, buy_rate, sell_rate) VALUES
  ('USD', '4460.00', '4560.00'),
  ('EUR', '4640.00', '4765.00'),
  ('SGD', '3275.00', '3375.00'),
  ('THB', '131.58', '133.14'),
  ('MYR', '1013.00', '1040.00'),
  ('JPY', '28.49', '29.26'),
  ('CNY', '610.00', '627.00'),
  ('WON', '3.09', '3.17'),
  ('GBP', '5520.00', '5670.00'),
  ('AUD', '2790.00', '2865.00'),
  ('CAD', '3080.00', '3165.00'),
  ('NTD', '135.00', '139.00'),
  ('AED', '1207.00', '1240.00'),
  ('INR', '51.35', '52.75'),
  ('HKD', '556.00', '565.00'),
  ('MOP', '552.00', '567.00')
ON CONFLICT (currency) DO UPDATE SET
  buy_rate = EXCLUDED.buy_rate,
  sell_rate = EXCLUDED.sell_rate,
  updated_at = now();

-- Insert initial data for gold prices
INSERT INTO gold_prices (type, price, change, category) VALUES
  -- World Gold Prices
  ('24 Karat', 2742.96, -2.14, 'world'),
  ('22 Karat', 2534.57, -1.14, 'world'),
  ('21 Karat', 2400.27, -0.14, 'world'),
  ('18 Karat', 2087.37, -1.24, 'world'),
  -- Myanmar Gold Prices
  ('16 Pae Yae', 6423906.08, -2500, 'myanmar'),
  ('15 Pae Yae', 6155862.92, -2000, 'myanmar'),
  ('14 Pae 2 Pae Yae', 5887840.89, -1800, 'myanmar'),
  ('14 Pae Yae', 5620219.64, -1500, 'myanmar'),
  ('13 Pae Yae', 5152588.40, -1200, 'myanmar'),
  ('12 Pae 2 Pae Yae', 4817333.26, -1000, 'myanmar'),
  ('11 Pae Yae', 4282070.72, -800, 'myanmar'),
  ('9 Pae Yae', 3746805.52, -600, 'myanmar')
ON CONFLICT (type) DO UPDATE SET
  price = EXCLUDED.price,
  change = EXCLUDED.change,
  updated_at = now();