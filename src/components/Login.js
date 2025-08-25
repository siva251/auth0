import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 transition-colors hover:shadow-2xl hover:scale-[1.01] duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 transition-transform duration-300 hover:rotate-6 hover:scale-110">
              {/* lock icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700 dark:text-gray-200"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9z" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Secure login powered by Auth0
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => loginWithRedirect()}
              disabled={isLoading}
              className="relative overflow-hidden w-full rounded-xl px-4 py-3 font-semibold 
                         bg-blue-600 text-white 
                         hover:bg-blue-700 disabled:opacity-70 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 
                         dark:focus:ring-offset-gray-900 transition duration-300 group"
            >
              {/* Shimmer layer */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                              transition-transform duration-700 ease-in-out">
                <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r 
                                from-transparent via-white/40 to-transparent 
                                skew-x-12"></span>
              </span>

              <span className="relative z-10">
                {isLoading ? "Loading…" : "Continue with Auth0"}
              </span>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Having trouble? Refresh the page and try again.
        </p>
      </div>
    </div>
  );
};

export default Login;
