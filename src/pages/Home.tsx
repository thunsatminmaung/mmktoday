import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Facebook, MessageCircle, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { socialConfig } from '../config/social';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="mb-8 flex justify-center">
          <img
            src="/mmk-today.png"
            alt="MMK Today Logo"
            className="h-40 w-auto object-contain"
          />
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
          Welcome to MMK Today
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Your trusted source for real-time Myanmar currency exchange rates and gold prices
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link 
          to="/exchange-rates" 
          className="group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        >
          <div className="relative h-full bg-white dark:bg-gray-900 rounded-xl p-8 transition-transform duration-500 group-hover:scale-[0.98]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Exchange Rates</h2>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Get real-time currency exchange rates for Myanmar Kyat (MMK) against major world currencies.
            </p>
            <span className="inline-flex items-center text-blue-600 font-semibold">
              View Rates
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        <Link 
          to="/gold-prices" 
          className="group relative overflow-hidden rounded-2xl p-1 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500"
        >
          <div className="relative h-full bg-white dark:bg-gray-900 rounded-xl p-8 transition-transform duration-500 group-hover:scale-[0.98]">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Gold Prices</h2>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Track live gold prices in Myanmar and international markets with real-time updates.
            </p>
            <span className="inline-flex items-center text-amber-600 font-semibold">
              View Prices
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
          {posts.map((post) => (
            <div key={post.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src="/mmk-today-logo.png"
                    alt="MMK Today"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-2">{post.content}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <div className="grid grid-cols-2 gap-6">
            <a
              href={socialConfig.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-gradient-to-br from-blue-500 to-blue-600"
            >
              <Facebook className="h-8 w-8 text-white mb-3" />
              <span className="font-semibold text-white">Facebook</span>
            </a>
            
            <a
              href={socialConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-gradient-to-br from-sky-500 to-sky-600"
            >
              <MessageCircle className="h-8 w-8 text-white mb-3" />
              <span className="font-semibold text-white">Telegram</span>
            </a>
            
            <a
              href={socialConfig.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-gradient-to-br from-red-500 to-red-600"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="h-8 w-8 text-white mb-3"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="font-semibold text-white">YouTube</span>
            </a>
            
            <a
              href={socialConfig.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card bg-gradient-to-br from-pink-500 to-pink-600"
            >
              <Video className="h-8 w-8 text-white mb-3" />
              <span className="font-semibold text-white">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;