// src/App.js
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { setAuth, setLoading } from "./auth/authSlice";
import Loading from "./components/Loading";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./components/Login";
import Welcome from "./components/Welcome";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const CALLBACK_URL = process.env.REACT_APP_CALLBACK_URL;
const LOGOUT_RETURN_URL = process.env.REACT_APP_LOGOUT_RETURN_URL;


const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, logout } = useAuth0();
  const navigate = useNavigate();

  const isAuthenticatedFromRedux = useSelector(
    (state) => state.auth.isAuthenticated
  );
  const isLoadingFromRedux = useSelector((state) => state.auth.isLoading);

  const logoutTimer = useRef(null);

  // Sync loading state
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  // Sync auth state
  useEffect(() => {
    if (!isLoading) {
      dispatch(setAuth({ isAuthenticated, user }));
    }
  }, [isLoading, isAuthenticated, user, dispatch]);

  // Navigation + auto-logout
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAuthenticatedFromRedux) {
      dispatch(setAuth({ isAuthenticated, user }));
      navigate("/welcome");
    } else if (!isLoading && !isAuthenticated && isAuthenticatedFromRedux) {
      dispatch(setAuth({ isAuthenticated: false, user: null }));
      navigate("/login");
    }

    // Auto logout after 5 minutes
    if (isAuthenticated) {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        logout({
          logoutParams: { returnTo: LOGOUT_RETURN_URL },
        });
      }, 300000);
    } else {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    }

    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [
    isLoading,
    isAuthenticated,
    user,
    dispatch,
    navigate,
    isAuthenticatedFromRedux,
    logout,
  ]);

  if (isLoadingFromRedux) return <Loading />;

  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useSelector((state) => state.theme);
  const themeClass = isDarkMode ? "dark" : "";

  if (!auth0Domain || !auth0ClientId) {
    return <div>Error: Auth0 environment variables are not set.</div>;
  }

  return (
    <HashRouter>
      <div className={`${themeClass}`}>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <ThemeToggle />
          <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
              redirect_uri: CALLBACK_URL,
            }}
          >
            <AuthWrapper>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route
                  path="/welcome"
                  element={
                    <ProtectedRoute>
                      <Welcome />
                    </ProtectedRoute>
                  }
                />
                {/* Catch-all 404 (keep last) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthWrapper>
          </Auth0Provider>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
