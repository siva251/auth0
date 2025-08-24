import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { setAuth, setLoading } from './auth/authSlice';
import Loading from './components/Loading';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import Welcome from './components/Welcome';
import ProtectedRoute from './components/ProtectedRoute';

// Check for environment variables
const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, logout } = useAuth0();
  const navigate = useNavigate();
  const isAuthenticatedFromRedux = useSelector((state) => state.auth.isAuthenticated);
  const isLoadingFromRedux = useSelector((state) => state.auth.isLoading);

  // Use a ref to store the timer, preventing it from being re-created on every render
  const logoutTimer = useRef(null);

  // Sync Auth0 loading state to Redux
  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);

  // Sync Auth0 auth state to Redux
  useEffect(() => {
    if (!isLoading) {
      dispatch(setAuth({ isAuthenticated, user }));
    }
  }, [isLoading, isAuthenticated, user, dispatch]);

  // Handle redirection and auto-logout timer
  useEffect(() => {
    // Redirect after a successful login if not already done
    if (!isLoading && isAuthenticated && !isAuthenticatedFromRedux) {
      dispatch(setAuth({ isAuthenticated, user }));
      navigate('/welcome');
    } else if (!isLoading && !isAuthenticated && isAuthenticatedFromRedux) {
      // In case the Auth0 session ends unexpectedly, log out from the app
      dispatch(setAuth({ isAuthenticated: false, user: null }));
      navigate('/login');
    }

    // Set the auto-logout timer when authenticated
    if (isAuthenticated) {
      // Clear any existing timer to prevent multiple timers running
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
      // Set a new timer for 5 minutes (300,000 milliseconds)
      logoutTimer.current = setTimeout(() => {
        console.log("Session expired, logging out automatically...");
        logout({ logoutParams: { returnTo: window.location.origin } });
      }, 300000);
    } else {
      // Clear the timer if the user logs out manually
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    }

    // Cleanup function to clear the timer when the component unmounts
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [isLoading, isAuthenticated, user, dispatch, navigate, isAuthenticatedFromRedux, logout]);

  if (isLoadingFromRedux) {
    return <Loading />;
  }

  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useSelector((state) => state.theme);
  const themeClass = isDarkMode ? "dark" : "";

  // Add a check to ensure environment variables are loaded
  if (!auth0Domain || !auth0ClientId) {
    return <div>Error: Auth0 environment variables are not set.</div>;
  }

  return (
    <Router>
      <div className={`${themeClass}`}>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <ThemeToggle />
          <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
              redirect_uri: window.location.origin,
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
    </Router>
  );
}

export default App;