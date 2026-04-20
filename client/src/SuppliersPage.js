import { useEffect, useState } from "react";
import { suppliersAPI } from "./api";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
  });

  const loadData = async () => {
    const res = await suppliersAPI.getAll();
    setSuppliers(res.data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await suppliersAPI.create(form);
    setForm({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
    });
    loadData();
  };

  return (
    <div className="page form-page">
      <h1>Suppliers</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <input placeholder="Supplier name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Contact person" value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <button type="submit">Add Supplier</button>
      </form>
      <div className="card">
        <ul>
          {suppliers.map((item) => (
            <li key={item.id}>{item.name} - {item.contact_person} - {item.phone}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}