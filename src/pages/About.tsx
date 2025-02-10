import React from 'react';

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card">
        <div className="mb-8 flex justify-center">
          <img
            src="/mmk-today-logo.png"
            alt="MMK Today Logo"
            className="h-32 w-32 object-cover"
          />
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">About MMK Today</h1>
          <p className="text-lg text-gray-700 mb-6">
            Your trusted source for real-time Myanmar currency exchange rates and gold prices.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Our Mission</h2>
            <p className="text-gray-700">
              To provide accurate, up-to-date financial information to help you make informed decisions
              about currency exchange and gold investments in Myanmar.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Real-time currency exchange rates</li>
              <li>Live gold prices (World & Myanmar)</li>
              <li>Market analysis and updates</li>
              <li>Financial news and insights</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Contact Us</h2>
            <p className="text-gray-700">
              For inquiries and support, please reach out to us through our social media channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;