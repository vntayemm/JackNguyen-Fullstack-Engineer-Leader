import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle forgot password logic
  };

  return (
    <AuthLayout>
      <div className="text-center mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 md:hidden">DNS/Email Security Tool</h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Forgot your password?</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition text-sm"
        >
          Send Reset Link
        </button>
      </form>
      <div className="mt-4 md:mt-6 text-center text-gray-600 dark:text-gray-300 text-sm">
        Remember your password? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 