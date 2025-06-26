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
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Forgot your password?</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-1 text-gray-900 dark:text-white">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Send Reset Link
        </button>
      </form>
      <div className="mt-6 text-center text-gray-600 dark:text-gray-300 text-sm">
        Remember your password? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword; 