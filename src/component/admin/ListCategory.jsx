import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsPencil, BsTrash } from 'react-icons/bs';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Categories/GetCategory');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      if (data.success) {
        setCategories(data.category);
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangleFill className="me-2" />
        <div>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">Categories</h2>
              <p className="text-muted mb-0">Manage all product categories</p>
            </div>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <BsPlusCircle />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">All Categories</h5>
                <span className="badge bg-primary rounded-pill">{categories.length}</span>
              </div>
            </div>
            <div className="card-body p-4">
              {categories.length === 0 ? (
                <div className="text-center py-5">
                  <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
                  <h5 className="text-muted mt-3">No categories found</h5>
                  <p className="text-muted">Start by adding your first category</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="px-4 py-3">#</th>
                        <th scope="col" className="py-3">Category Name</th>
                        <th scope="col" className="py-3 text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, index) => (
                        <tr key={category.categoryId}>
                          <td className="px-4 py-3 text-muted">{index + 1}</td>
                          <td className="py-3">
                            <span className="fw-medium">{category.categoryName}</span>
                          </td>
                          <td className="py-3 text-end px-4">
                            <div className="btn-group btn-group-sm" role="group">
                              <button 
                                className="btn btn-outline-primary me-2"
                                title="Edit"
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-outline-danger"
                                title="Delete"
                              >
                                delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCategory;
