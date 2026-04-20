import { useEffect, useState } from "react";
import { transactionsAPI, productsAPI } from "./api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    transaction_type: "IN",
    quantity_changed: 1,
    note: "",
  });

  const loadData = async () => {
    const [txRes, productsRes] = await Promise.all([
      transactionsAPI.getAll(),
      productsAPI.getAll(),
    ]);
    setTransactions(txRes.data.data || []);
    setProducts(productsRes.data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await transactionsAPI.create({
      ...form,
      product_id: Number(form.product_id),
      quantity_changed: Number(form.quantity_changed),
    });
    setForm({
      product_id: "",
      transaction_type: "IN",
      quantity_changed: 1,
      note: "",
    });
    loadData();
  };

  return (
    <div className="page form-page">
      <h1>Transactions</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required>
          <option value="">Select Product</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.sku})
            </option>
          ))}
        </select>
        <select value={form.transaction_type} onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}>
          <option value="IN">Stock In</option>
          <option value="OUT">Stock Out</option>
        </select>
        <input type="number" value={form.quantity_changed} onChange={(e) => setForm({ ...form, quantity_changed: e.target.value })} required />
        <textarea placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button type="submit">Save Transaction</button>
      </form>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.product_id}</td>
                <td>{item.transaction_type}</td>
                <td>{item.quantity_changed}</td>
                <td>{item.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}