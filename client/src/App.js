import './styles.css';

import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import SuppliersPage from "./SuppliersPage";
import TransactionsPage from "./TransactionsPage";

function NavBar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/products">Products</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/suppliers">Suppliers</Link>
      <Link to="/transactions">Transactions</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><SuppliersPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
