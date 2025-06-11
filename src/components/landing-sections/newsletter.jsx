import React, { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Stay ahead of the curve
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the latest financial insights, product updates, and exclusive
              offers delivered to your inbox every week.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <span className="text-sm">✓ Subscribed!</span>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Unsubscribe anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>1M+ subscribers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
