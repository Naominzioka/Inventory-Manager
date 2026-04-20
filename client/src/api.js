const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let products = [
  {
    id: 1,
    name: "Milk",
    sku: "MILK001",
    description: "Fresh whole milk",
    quantity_in_stock: 12,
    unit_price: 120,
    reorder_level: 5,
    expiry_date: "",
    category_id: 1,
    supplier_id: 1,
  },
  {
    id: 2,
    name: "Bread",
    sku: "BRD001",
    description: "White bread",
    quantity_in_stock: 4,
    unit_price: 65,
    reorder_level: 6,
    expiry_date: "",
    category_id: 2,
    supplier_id: 2,
  },
];

let categories = [
  { id: 1, name: "Dairy", description: "Milk and dairy products" },
  { id: 2, name: "Bakery", description: "Bread and baked goods" },
];

let suppliers = [
  {
    id: 1,
    name: "Fresh Supply Ltd",
    contact_person: "Jane Doe",
    phone: "0700000000",
    email: "fresh@example.com",
    address: "Nairobi",
  },
  {
    id: 2,
    name: "Bake House Ltd",
    contact_person: "John Doe",
    phone: "0711111111",
    email: "bake@example.com",
    address: "Kiambu",
  },
];

let transactions = [
  {
    id: 1,
    product_id: 1,
    transaction_type: "IN",
    quantity_changed: 10,
    note: "Initial stock",
  },
];

export const productsAPI = {
  getAll: async () => {
    await delay();
    return { data: { data: products } };
  },

  create: async (payload) => {
    await delay();
    const newProduct = { id: Date.now(), ...payload };
    products = [...products, newProduct];
    return { data: { data: newProduct } };
  },

  update: async (id, payload) => {
    await delay();
    products = products.map((item) =>
      item.id === id ? { ...item, ...payload } : item
    );
    return { data: { data: products.find((item) => item.id === id) } };
  },

  remove: async (id) => {
    await delay();
    products = products.filter((item) => item.id !== id);
    return { data: { message: "Deleted successfully" } };
  },
};

export const categoriesAPI = {
  getAll: async () => {
    await delay();
    return { data: { data: categories } };
  },

  create: async (payload) => {
    await delay();
    const newCategory = { id: Date.now(), ...payload };
    categories = [...categories, newCategory];
    return { data: { data: newCategory } };
  },
};

export const suppliersAPI = {
  getAll: async () => {
    await delay();
    return { data: { data: suppliers } };
  },

  create: async (payload) => {
    await delay();
    const newSupplier = { id: Date.now(), ...payload };
    suppliers = [...suppliers, newSupplier];
    return { data: { data: newSupplier } };
  },
};

export const transactionsAPI = {
  getAll: async () => {
    await delay();
    return { data: { data: transactions } };
  },

  create: async (payload) => {
    await delay();

    const product = products.find((p) => p.id === payload.product_id);
    if (!product) {
      throw new Error("Product not found");
    }

    if (payload.transaction_type === "IN") {
      product.quantity_in_stock += payload.quantity_changed;
    } else {
      if (payload.quantity_changed > product.quantity_in_stock) {
        throw new Error("Insufficient stock");
      }
      product.quantity_in_stock -= payload.quantity_changed;
    }

    const newTransaction = { id: Date.now(), ...payload };
    transactions = [newTransaction, ...transactions];
    return { data: { data: newTransaction } };
  },
};