import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsPencil, BsTrash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

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

  // Add Category Functions
  const handleShowModal = () => {
    setShowModal(true);
    setCategoryName('');
    setValidationError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName('');
    setValidationError('');
  };

  const validateForm = (name) => {
    if (!name.trim()) {
      setValidationError('Category name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setValidationError('Category name must be at least 2 characters');
      return false;
    }
    if (name.trim().length > 50) {
      setValidationError('Category name must not exceed 50 characters');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(categoryName)) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('https://localhost:7208/api/Categories/AddCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: categoryName.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Category added successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseModal();
        fetchCategories();
      } else {
        toast.error(data.message || 'Failed to add category', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while adding category', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Category Functions
  const handleShowEditModal = (category) => {
    setEditCategoryId(category.categoryId);
    setEditCategoryName(category.categoryName);
    setShowEditModal(true);
    setValidationError('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditCategoryId(null);
    setEditCategoryName('');
    setValidationError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editCategoryName)) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Categories/UpdateCategory/${editCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryName: editCategoryName.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Category updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseEditModal();
        fetchCategories();
      } else {
        toast.error(data.message || 'Failed to update category', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while updating category', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Category Functions
  const handleShowDeleteModal = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteCategoryId(null);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Categories/DeleteCategory?Categoryid=${deleteCategoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Category deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseDeleteModal();
        fetchCategories();
      } else {
        toast.error(data.message || 'Failed to delete category', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while deleting category', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    if (isEdit) {
      setEditCategoryName(e.target.value);
    } else {
      setCategoryName(e.target.value);
    }
    if (validationError) {
      setValidationError('');
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
    <>
      <ToastContainer />
      
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-1">Categories</h2>
                <p className="text-muted mb-0">Manage all product categories</p>
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleShowModal}
              >
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
                                  onClick={() => handleShowEditModal(category)}
                                >
                                  <BsPencil className="me-1" />
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  title="Delete"
                                  onClick={() => handleShowDeleteModal(category.categoryId)}
                                >
                                  <BsTrash className="me-1" />
                                  Delete
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

      {/* Add Category Modal */}
      {showModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040 }}
            onClick={handleCloseModal}
          ></div>
          
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ zIndex: 1050 }}
            onClick={handleCloseModal}
          >
            <div 
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Category</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                    disabled={submitting}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="categoryName" className="form-label">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationError ? 'is-invalid' : ''}`}
                        id="categoryName"
                        placeholder="Enter category name"
                        value={categoryName}
                        onChange={(e) => handleInputChange(e, false)}
                        autoFocus
                        disabled={submitting}
                      />
                      {validationError && (
                        <div className="invalid-feedback d-block">
                          {validationError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Adding...
                        </>
                      ) : (
                        'Add Category'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCloseModal}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040 }}
            onClick={handleCloseEditModal}
          ></div>
          
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ zIndex: 1050 }}
            onClick={handleCloseEditModal}
          >
            <div 
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Category</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseEditModal}
                    disabled={submitting}
                  ></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="editCategoryName" className="form-label">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationError ? 'is-invalid' : ''}`}
                        id="editCategoryName"
                        placeholder="Enter category name"
                        value={editCategoryName}
                        onChange={(e) => handleInputChange(e, true)}
                        autoFocus
                        disabled={submitting}
                      />
                      {validationError && (
                        <div className="invalid-feedback d-block">
                          {validationError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Category'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleCloseEditModal}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040 }}
            onClick={handleCloseDeleteModal}
          ></div>
          
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ zIndex: 1050 }}
            onClick={handleCloseDeleteModal}
          >
            <div 
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <BsExclamationTriangleFill className="me-2" />
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseDeleteModal}
                    disabled={submitting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to delete this category?</p>
                  <p className="text-muted mb-0 mt-2">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseDeleteModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <BsTrash className="me-1" />
                        Delete
                      </>
                    )}
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ListCategory;
