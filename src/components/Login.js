import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={() =>
          loginWithRedirect({
            authorizationParams: {
              redirect_uri: "https://siva251.github.io/auth0/#/welcome"
            }
          })
        }
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </div>
  );
};

export default Login;
