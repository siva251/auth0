import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { setAuth, setLoading } from './auth/authSlice';
import Loading from './components/Loading';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import Welcome from './components/Welcome';
import ProtectedRoute from './components/ProtectedRoute';

// Env
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

// Compute the correct base URL for localhost and GitHub Pages.
// On GH Pages it will be: https://siva251.github.io/auth0/
// On localhost it will be: http://localhost:3000/
const getAppBaseUrl = () => {
  const origin = window.location.origin;                 // e.g., https://siva251.github.io
  const onGhPages = window.location.pathname.startsWith('/auth0');
  const basePath = onGhPages ? '/auth0/' : '/';
  return origin + basePath;                              // no hash!
};

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, logout } = useAuth0();
  const navigate = useNavigate();
  const isAuthenticatedFromRedux = useSelector((s) => s.auth.isAuthenticated);
  const isLoadingFromRedux = useSelector((s) => s.auth.isLoading);

  const logoutTimer = useRef(null);
  const appBaseUrl = getAppBaseUrl();

  // Sync Auth0 -> Redux
  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (!isLoading) {
      dispatch(setAuth({ isAuthenticated, user }));
    }
  }, [isLoading, isAuthenticated, user, dispatch]);

  // Handle redirects + auto-logout
  useEffect(() => {
    if (!isLoading) {
      // If we just became authenticated, go to /welcome
      if (isAuthenticated && !isAuthenticatedFromRedux) {
        navigate('/welcome');
      }
      // If we just became unauthenticated, go to /login
      if (!isAuthenticated && isAuthenticatedFromRedux) {
        if (window.location.hash !== '#/login') navigate('/login');
      }
    }

    // Auto logout after 5 minutes
    if (isAuthenticated) {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      logoutTimer.current = setTimeout(() => {
        console.log('Session expired, logging out automatically...');
        logout({
          logoutParams: {
            // IMPORTANT: no hash here; must match Auth0 Allowed Logout URL
            returnTo: appBaseUrl,
          },
        });
      }, 300000);
    } else {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
        logoutTimer.current = null;
      }
    }

    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
    };
  }, [isLoading, isAuthenticated, isAuthenticatedFromRedux, navigate, logout, appBaseUrl]);

  if (isLoadingFromRedux) return <Loading />;
  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useSelector((s) => s.theme);
  const themeClass = isDarkMode ? 'dark' : '';

  if (!auth0Domain || !auth0ClientId) {
    return <div>Error: Auth0 environment variables are not set.</div>;
  }

  const appBaseUrl = getAppBaseUrl(); // callback + logout use this (no hash)

  return (
    <HashRouter>
      <div className={`${themeClass}`}>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <ThemeToggle />
          <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
              // IMPORTANT: callback without hash; Auth0 must allow EXACTLY this
              redirect_uri: appBaseUrl,
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
