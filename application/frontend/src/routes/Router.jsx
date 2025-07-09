import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CookiesLog from '../pages/CookiesLog';
import CookiesDB from '../pages/CookiesDB';
import EditCredentials from '../pages/EditCredentials';
import EditTokenData from '../pages/EditTokenData';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protegidas */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/log-cookies" element={
          <ProtectedRoute>
            <CookiesLog />
          </ProtectedRoute>
        } />
        <Route path="/cookies-db" element={
          <ProtectedRoute>
            <CookiesDB />
          </ProtectedRoute>
        } />
        <Route path="/edit-credentials" element={
          <ProtectedRoute>
            <EditCredentials />
          </ProtectedRoute>
        } />
        <Route path="/edit-token-data" element={
          <ProtectedRoute>
            <EditTokenData />
          </ProtectedRoute>
        } />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
