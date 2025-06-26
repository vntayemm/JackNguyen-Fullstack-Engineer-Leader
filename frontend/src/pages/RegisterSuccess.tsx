import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const RegisterSuccess: React.FC = () => {
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Registration Successful!</h2>
        </div>
        
        <div className="mb-6 text-gray-600 dark:text-gray-300">
          <p className="mb-4">
            Thank you for registering with DNS/Email Security Tool!
          </p>
          <p className="mb-4">
            We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
          </p>
          <p className="text-sm">
            If you don't see the email, please check your spam folder.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What's next?</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 text-left space-y-1">
            <li>• Check your email for the verification link</li>
            <li>• Click the verification link to activate your account</li>
            <li>• Return here to sign in with your credentials</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition text-center"
          >
            Go to Sign In
          </Link>
          
          <Link
            to="/register"
            className="block w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition text-center"
          >
            Register Another Account
          </Link>
        </div>
        
        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Didn't receive the email?</p>
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Try registering again
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterSuccess; 