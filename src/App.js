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

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, logout } = useAuth0();
  const navigate = useNavigate();
  const isAuthenticatedFromRedux = useSelector(
    (state) => state.auth.isAuthenticated
  );
  const isLoadingFromRedux = useSelector((state) => state.auth.isLoading);

  const logoutTimer = useRef(null);

  // Sync loading
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  // Sync auth state
  useEffect(() => {
    if (!isLoading) {
      dispatch(setAuth({ isAuthenticated, user }));
    }
  }, [isLoading, isAuthenticated, user, dispatch]);

  // Handle navigation and auto-logout
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
          logoutParams: {
            returnTo: "https://siva251.github.io/auth0/#/login", // ✅ EXACTLY what you added in Auth0 Allowed Logout URLs
          },
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
    redirect_uri: window.location.origin + "/auth0/#/login", 
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
    </Routes>
  </AuthWrapper>
</Auth0Provider>

        </div>
      </div>
    </HashRouter>
  );
}

export default App;
