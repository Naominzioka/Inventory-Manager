import { useEffect, useState } from "react";
import { productsAPI, categoriesAPI, suppliersAPI } from "./api";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  quantity_in_stock: 0,
  unit_price: "",
  reorder_level: 5,
  expiry_date: "",
  category_id: "",
  supplier_id: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
      productsAPI.getAll(),
      categoriesAPI.getAll(),
      suppliersAPI.getAll(),
    ]);

    setProducts(productsRes.data.data || []);
    setCategories(categoriesRes.data.data || []);
    setSuppliers(suppliersRes.data.data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      quantity_in_stock: Number(form.quantity_in_stock),
      unit_price: Number(form.unit_price),
      reorder_level: Number(form.reorder_level),
      category_id: Number(form.category_id),
      supplier_id: Number(form.supplier_id),
    };

    if (editingId) {
      await productsAPI.update(editingId, payload);
    } else {
      await productsAPI.create(payload);
    }

    setForm(initialForm);
    setEditingId(null);
    loadData();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ ...product });
  };

  const handleDelete = async (id) => {
    await productsAPI.remove(id);
    loadData();
  };

  return (
    <div className="page form-page">
      <h1>Products</h1>

      <form className="card form" onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Quantity" value={form.quantity_in_stock} onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })} required />
        <input type="number" placeholder="Unit Price" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} required />
        <input type="number" placeholder="Reorder Level" value={form.reorder_level} onChange={(e) => setForm({ ...form, reorder_level: e.target.value })} required />
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
          <option value="">Select Category</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })} required>
          <option value="">Select Supplier</option>
          {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>{item.quantity_in_stock}</td>
                <td>{item.unit_price}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}