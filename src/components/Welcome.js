import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

const LOGOUT_RETURN_URL = "https://siva251.github.io/auth0/#/login"; // ✅ Correct URL

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout } = useAuth0();
  const profilePic = user?.picture?.split("&d=")[0];

  if (!user) {
    return null; // Don't render if no user data
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-lg text-center transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome, {user.name}!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">You are logged in successfully.</p>
        <div className="flex flex-col items-center mt-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-400 mb-4"
          />
          <div className="text-left w-full">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Nickname:</span> {user.nickname}
            </p>
          </div>
        </div>
        <button
          onClick={() => logout({ logoutParams: { returnTo: LOGOUT_RETURN_URL } })}
          className="mt-8 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Welcome;
