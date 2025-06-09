'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We’ll get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-apple-light pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-hero font-semibold text-apple-black mb-8 text-center tracking-tight">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl apple-shadow p-8">
            <h2 className="text-2xl font-semibold text-apple-black mb-4">Get in Touch</h2>
            <p className="text-apple-gray mb-4">Have questions? We’re here to help.</p>
            <p className="text-apple-gray mb-2"><strong>Email:</strong> support@timetech.com</p>
            <p className="text-apple-gray mb-2"><strong>Phone:</strong> (123) 456-7890</p>
            <p className="text-apple-gray"><strong>Address:</strong> 123 Tech Lane, Innovation City, TC 45678</p>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl apple-shadow p-8">
            <h2 className="text-2xl font-semibold text-apple-black mb-4">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black placeholder-apple-gray"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black placeholder-apple-gray"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black placeholder-apple-gray"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-apple-black text-white py-3 rounded-apple font-medium hover:bg-apple-blue transition-colors apple-shadow"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}