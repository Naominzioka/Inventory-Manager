import { useEffect, useState } from "react";
import { categoriesAPI } from "./api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const loadData = async () => {
    const res = await categoriesAPI.getAll();
    setCategories(res.data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await categoriesAPI.create(form);
    setForm({ name: "", description: "" });
    loadData();
  };

  return (
    <div className="page form-page">
      <h1>Categories</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <input placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Add Category</button>
      </form>
      <div className="card">
        <ul>
          {categories.map((item) => (
            <li key={item.id}>{item.name} - {item.description || "No description"}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}