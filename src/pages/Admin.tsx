import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

interface Rate {
  currency: string;
  buy: string;
  sell: string;
}

interface GoldPrice {
  type: string;
  price: number;
  change: number;
  category: 'world' | 'myanmar';
}

function Admin() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [rates, setRates] = useState<Rate[]>([
    { currency: 'USD', buy: '4460.00', sell: '4560.00' },
    { currency: 'EUR', buy: '4640.00', sell: '4765.00' },
    { currency: 'SGD', buy: '3275.00', sell: '3375.00' },
    { currency: 'THB', buy: '131.58', sell: '133.14' },
    { currency: 'MYR', buy: '1013.00', sell: '1040.00' },
    { currency: 'JPY', buy: '28.49', sell: '29.26' },
    { currency: 'CNY', buy: '610.00', sell: '627.00' },
    { currency: 'WON', buy: '3.09', sell: '3.17' },
    { currency: 'GBP', buy: '5520.00', sell: '5670.00' },
    { currency: 'AUD', buy: '2790.00', sell: '2865.00' },
    { currency: 'CAD', buy: '3080.00', sell: '3165.00' },
    { currency: 'NTD', buy: '135.00', sell: '139.00' },
    { currency: 'AED', buy: '1207.00', sell: '1240.00' },
    { currency: 'INR', buy: '51.35', sell: '52.75' },
    { currency: 'HKD', buy: '556.00', sell: '565.00' },
    { currency: 'MOP', buy: '552.00', sell: '567.00' }
  ]);

  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([
    // World Gold Prices
    { type: '24 Karat', price: 2742.96, change: -2.14, category: 'world' },
    { type: '22 Karat', price: 2534.57, change: -1.14, category: 'world' },
    { type: '21 Karat', price: 2400.27, change: -0.14, category: 'world' },
    { type: '18 Karat', price: 2087.37, change: -1.24, category: 'world' },
    // Myanmar Gold Prices
    { type: '16 Pae Yae', price: 6423906.08, change: -2500, category: 'myanmar' },
    { type: '15 Pae Yae', price: 6155862.92, change: -2000, category: 'myanmar' },
    { type: '14 Pae 2 Pae Yae', price: 5887840.89, change: -1800, category: 'myanmar' },
    { type: '14 Pae Yae', price: 5620219.64, change: -1500, category: 'myanmar' },
    { type: '13 Pae Yae', price: 5152588.40, change: -1200, category: 'myanmar' },
    { type: '12 Pae 2 Pae Yae', price: 4817333.26, change: -1000, category: 'myanmar' },
    { type: '11 Pae Yae', price: 4282070.72, change: -800, category: 'myanmar' },
    { type: '9 Pae Yae', price: 3746805.52, change: -600, category: 'myanmar' }
  ]);

  useEffect(() => {
    fetchPosts();
    fetchRates();
    fetchGoldPrices();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('exchange_rates')
        .select('currency, buy_rate, sell_rate');

      if (error) throw error;
      if (data) {
        setRates(data.map(rate => ({
          currency: rate.currency,
          buy: rate.buy_rate,
          sell: rate.sell_rate
        })));
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const fetchGoldPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('gold_prices')
        .select('*');

      if (error) throw error;
      if (data) {
        setGoldPrices(data);
      }
    } catch (error) {
      console.error('Error fetching gold prices:', error);
    }
  };

  const createPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...newPost, published: false }])
        .select()
        .single();

      if (error) throw error;
      setPosts([data, ...posts]);
      setNewPost({ title: '', content: '' });
      setIsCreating(false);
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.map(post => post.id === id ? { ...post, ...updates } : post));
      setEditingPost(null);
      toast.success('Post updated successfully');
    } catch (error) {
      toast.error('Failed to update post');
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.filter(post => post.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleRateChange = (currency: string, field: 'buy' | 'sell', value: string) => {
    setRates(rates.map(rate => 
      rate.currency === currency ? { ...rate, [field]: value } : rate
    ));
  };

  const handleGoldPriceChange = (type: string, field: 'price' | 'change', value: number) => {
    setGoldPrices(prices => 
      prices.map(price => 
        price.type === type ? { ...price, [field]: value } : price
      )
    );
  };

  const updatePrices = async () => {
    try {
      // Update exchange rates
      const { error: ratesError } = await supabase
        .from('exchange_rates')
        .upsert(
          rates.map(rate => ({
            currency: rate.currency,
            buy_rate: rate.buy,
            sell_rate: rate.sell,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'currency' }
        );

      if (ratesError) throw ratesError;

      // Update gold prices
      const { error: goldError } = await supabase
        .from('gold_prices')
        .upsert(
          goldPrices.map(price => ({
            type: price.type,
            price: price.price,
            change: price.change,
            category: price.category,
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'type' }
        );

      if (goldError) throw goldError;

      toast.success('Prices updated successfully');
      
      // Refresh the data
      await Promise.all([fetchRates(), fetchGoldPrices()]);
    } catch (error) {
      console.error('Error updating prices:', error);
      toast.error('Failed to update prices');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Manage Rates & Prices</h2>
          <button
            onClick={updatePrices}
            className="btn bg-green-500 hover:bg-green-600 text-white"
          >
            Update Prices
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Exchange Rates</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {rates.map((rate) => (
                <div key={rate.currency} className="flex items-center space-x-4">
                  <span className="w-20 font-medium">{rate.currency}</span>
                  <input
                    type="text"
                    value={rate.buy}
                    onChange={(e) => handleRateChange(rate.currency, 'buy', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Buy Rate"
                  />
                  <input
                    type="text"
                    value={rate.sell}
                    onChange={(e) => handleRateChange(rate.currency, 'sell', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Sell Rate"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">World Gold Prices</h3>
            <div className="space-y-4">
              {goldPrices
                .filter(price => price.category === 'world')
                .map((price) => (
                  <div key={price.type} className="flex items-center space-x-4">
                    <span className="w-24 font-medium">{price.type}</span>
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => handleGoldPriceChange(price.type, 'price', parseFloat(e.target.value))}
                      className="flex-1 p-2 border rounded"
                      placeholder="Price"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={price.change}
                      onChange={(e) => handleGoldPriceChange(price.type, 'change', parseFloat(e.target.value))}
                      className="w-32 p-2 border rounded"
                      placeholder="Change"
                      step="0.01"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Myanmar Gold Prices</h3>
            <div className="space-y-4">
              {goldPrices
                .filter(price => price.category === 'myanmar')
                .map((price) => (
                  <div key={price.type} className="flex items-center space-x-4">
                    <span className="w-32 font-medium">{price.type}</span>
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => handleGoldPriceChange(price.type, 'price', parseFloat(e.target.value))}
                      className="flex-1 p-2 border rounded"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={price.change}
                      onChange={(e) => handleGoldPriceChange(price.type, 'change', parseFloat(e.target.value))}
                      className="w-32 p-2 border rounded"
                      placeholder="Change"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Posts</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Post</span>
          </button>
        </div>

        {isCreating && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Post content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full p-2 border rounded h-32"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  className="btn btn-primary"
                  disabled={!newPost.title || !newPost.content}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No posts yet</div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="p-6 bg-gray-50 rounded-lg">
                {editingPost?.id === post.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="w-full p-2 border rounded h-32"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPost(null)}
                        className="p-2 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updatePost(post.id, editingPost)}
                        className="p-2 text-green-600 hover:text-green-800"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700">{post.content}</p>
                    <div className="mt-4">
                      <button
                        onClick={() => updatePost(post.id, { published: !post.published })}
                        className={`px-3 py-1 rounded text-sm ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;