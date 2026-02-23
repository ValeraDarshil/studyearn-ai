import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, isLoggedIn } = useApp();
  const token = localStorage.getItem('token');

  // ✅ WAIT for loading to finish before checking auth
  if (loading) {
    return null; // or a small spinner
  }

  // If no token, redirect to login
  if (!token || !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}