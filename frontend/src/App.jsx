import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CollectionProvider } from './context/CollectionContext';
import Layout from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import AddEditCar from './pages/AddEditCar';
import CarDetails from './pages/CarDetails';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

import { ThemeProvider } from './context/ThemeContext';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CollectionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="collection" element={<Collection />} />
                <Route path="add" element={<AddEditCar />} />
                <Route path="edit/:id" element={<AddEditCar />} />
                <Route path="car/:id" element={<CarDetails />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CollectionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
