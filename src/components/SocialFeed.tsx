import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, MessageCircle, Video } from 'lucide-react';
import type { SocialPost } from '../types/social';

interface SocialFeedProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

function SocialFeed({ currentSlide, onSlideChange }: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '1',
      platform: 'facebook',
      content: 'Latest exchange rates update! Check out the new USD/MMK rates.',
      link: 'https://www.facebook.com/share/1AmZzeQXco/',
      timestamp: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: '2',
      platform: 'youtube',
      content: 'New video: Weekly Market Analysis - Gold Price Trends',
      link: 'https://youtube.com/@mmktoday',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      platform: 'telegram',
      content: 'Instant alert: Significant movement in EUR/MMK exchange rate',
      link: 'https://t.me/mmktoday',
      timestamp: new Date().toISOString()
    }
  ]);

  const getPlatformIcon = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      case 'telegram':
        return <MessageCircle className="h-5 w-5 text-sky-500" />;
      case 'tiktok':
        return <Video className="h-5 w-5 text-pink-600" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-sm shadow-lg h-[400px]">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full flex-shrink-0 p-6">
            <a 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full hover:opacity-90 transition-opacity"
            >
              <div className="flex items-start space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <img 
                    src="/mmk-today.png"
                    alt="MMK Today"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold">MMK Today</span>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {post.image && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt="Post content"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <p className="text-gray-700 text-lg">{post.content}</p>
            </a>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'
            }`}
            onClick={() => onSlideChange(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default SocialFeed;