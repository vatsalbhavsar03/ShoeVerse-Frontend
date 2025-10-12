import React, { useState } from 'react';

function ListProduct() {
  const [products] = useState([
    { id: 1, name: 'Nike Air Max 270', category: 'Running', price: 150, stock: 45, image: '👟', sales: 234 },
    { id: 2, name: 'Adidas Ultraboost', category: 'Running', price: 180, stock: 32, image: '👟', sales: 189 },
    { id: 3, name: 'Puma Suede Classic', category: 'Casual', price: 75, stock: 67, image: '👞', sales: 156 },
    { id: 4, name: 'Converse Chuck Taylor', category: 'Casual', price: 65, stock: 89, image: '👟', sales: 298 },
  ]);

  const getStockClass = (stock) => {
    if (stock > 50) return 'bg-success text-white';
    if (stock > 20) return 'bg-warning text-dark';
    return 'bg-danger text-white';
  };

  return (
    <div className="card shadow-sm overflow-hidden">
      {/* Header with title, search, and add button */}
      <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-3">
        <h5 className="mb-0">Products Management</h5>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search products..."
            style={{ minWidth: '200px' }}
          />
          <button className="btn btn-primary fw-semibold">➕ Add Product</button>
        </div>
      </div>

      {/* Products table */}
      <div className="table-responsive">
        <table className="table mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '32px' }}>{p.image}</span>
                    {p.name}
                  </div>
                </td>
                <td className="text-muted">{p.category}</td>
                <td className="fw-semibold">${p.price}</td>
                <td>
                  <span className={`badge ${getStockClass(p.stock)}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="text-muted">{p.sales}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-light btn-sm">👁️</button>
                    <button className="btn btn-success btn-sm">✏️</button>
                    <button className="btn btn-danger btn-sm">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListProduct;
