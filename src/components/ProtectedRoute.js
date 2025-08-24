import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If the Auth0 SDK is still loading, don't render anything yet.
  if (isLoading) {
    return null; 
  }

  // Check if the user is authenticated.
  if (!isAuthenticated) {
    // If not authenticated, redirect them to the login page,
    // storing the current location so they can be redirected back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // This part directly addresses the "If the user is logged in and authorized → allow access to Welcome screen."
  // and "If the user is logged in but not authorized → redirect to Login screen." points in your summary.
  // Assuming all logged-in users are authorized for this project scope.
  const isAuthorized = true; 

  if (isAuthorized) {
    return children;
  } else {
    // For now, this part is a placeholder, as per your summary.
    // In a real application, you would implement authorization logic here.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;