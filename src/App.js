import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to Welcome page if the user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/welcome" />;
  }

  // Handle Auth0's loading state
  if (isLoading) {
    return null; // Or a loading spinner, handled in App.jsx
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4
                     bg-gray-100 dark:bg-gray-900">
      <div className="relative bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl
                     w-full max-w-md mx-auto text-center
                     transform transition-all duration-500 ease-in-out
                     hover:scale-105 hover:shadow-3xl">
        <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-20 z-0"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text
                          bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg font-light">
            Please sign in to access your dashboard.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="w-full py-3 rounded-full text-lg font-semibold tracking-wider
                       bg-gradient-to-r from-blue-500 to-purple-500 text-white
                       hover:from-blue-600 hover:to-purple-600 transition-all duration-300
                       transform hover:scale-105 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-purple-400 dark:focus:ring-gray-600"
          >
            Log In with Auth0
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;