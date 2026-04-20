import { useEffect, useState } from "react";
import { productsAPI, transactionsAPI } from "./api";
import { useAuth } from "./auth";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    transactions: 0,
  });

  useEffect(() => {
    async function loadData() {
      const [productsRes, txRes] = await Promise.all([
        productsAPI.getAll(),
        transactionsAPI.getAll(),
      ]);

      const products = productsRes.data.data || [];
      const transactions = txRes.data.data || [];
      const lowStock = products.filter(
        (item) => item.quantity_in_stock <= item.reorder_level
      );

      setStats({
        products: products.length,
        lowStock: lowStock.length,
        transactions: transactions.length,
      });
    }

    loadData();
  }, []);

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>

      {user && (
        <p className="dashboard-user">
          Logged in as <strong>{user.username}</strong> ({user.role})
        </p>
      )}

      <div className="grid">
        <div className="card">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className="card">
          <h3>Low Stock</h3>
          <p>{stats.lowStock}</p>
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <p>{stats.transactions}</p>
        </div>
      </div>
    </div>
  );
}