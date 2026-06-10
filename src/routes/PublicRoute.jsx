import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

export default function PublicRoute({ children, redirectTo = '/dashboard' }){
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to={redirectTo} replace />;
  return children;
}
