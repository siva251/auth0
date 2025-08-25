import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-xl text-center">
        <h1 className="text-7xl font-extrabold tracking-tight">404</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Oops! The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center rounded-xl px-5 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
