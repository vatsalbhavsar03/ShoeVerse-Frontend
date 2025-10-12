import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsPencil, BsTrash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editBrandId, setEditBrandId] = useState(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [deleteBrandId, setDeleteBrandId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Brands/GetBrands');

      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data = await response.json();

      if (data.success) {
        setBrands(data.brand);
      } else {
        throw new Error(data.message || 'Failed to fetch brands');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Categories/GetCategory');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      if (data.success) {
        setCategories(data.category);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Add Brand Functions
  const handleShowModal = () => {
    setShowModal(true);
    setBrandName('');
    setCategoryId('');
    setValidationError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBrandName('');
    setCategoryId('');
    setValidationError('');
  };

  const validateForm = (name, catId) => {
    if (!name.trim()) {
      setValidationError('Brand name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setValidationError('Brand name must be at least 2 characters');
      return false;
    }
    if (name.trim().length > 50) {
      setValidationError('Brand name must not exceed 50 characters');
      return false;
    }
    if (!catId) {
      setValidationError('Please select a category');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(brandName, categoryId)) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('https://localhost:7208/api/Brands/AddBrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: brandName.trim(),
          categoryId: parseInt(categoryId)
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Brand added successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseModal();
        fetchBrands();
      } else {
        toast.error(data.message || 'Failed to add brand', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while adding brand', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Brand Functions
  const handleShowEditModal = (brand) => {
    setEditBrandId(brand.brandId);
    setEditBrandName(brand.brandName);
    setEditCategoryId(brand.categoryId);
    setShowEditModal(true);
    setValidationError('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditBrandId(null);
    setEditBrandName('');
    setEditCategoryId('');
    setValidationError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editBrandName, editCategoryId)) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Brands/UpdateBrand/${editBrandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: editBrandName.trim(),
          categoryId: parseInt(editCategoryId)
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Brand updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseEditModal();
        fetchBrands();
      } else {
        toast.error(data.message || 'Failed to update brand', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while updating brand', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Brand Functions
  const handleShowDeleteModal = (brandId) => {
    setDeleteBrandId(brandId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteBrandId(null);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Brands/DeleteBrand?Brandid=${deleteBrandId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Brand deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseDeleteModal();
        fetchBrands();
      } else {
        toast.error(data.message || 'Failed to delete brand', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while deleting brand', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e, field, isEdit = false) => {
    const value = e.target.value;
    
    if (isEdit) {
      if (field === 'brandName') {
        setEditBrandName(value);
      } else if (field === 'categoryId') {
        setEditCategoryId(value);
      }
    } else {
      if (field === 'brandName') {
        setBrandName(value);
      } else if (field === 'categoryId') {
        setCategoryId(value);
      }
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
                <h2 className="fw-bold mb-1">Brands</h2>
                <p className="text-muted mb-0">Manage all product brands</p>
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleShowModal}
              >
                <BsPlusCircle />
                <span>Add Brand</span>
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">All Brands</h5>
                  <span className="badge bg-primary rounded-pill">{brands.length}</span>
                </div>
              </div>
              <div className="card-body p-4">
                {brands.length === 0 ? (
                  <div className="text-center py-5">
                    <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
                    <h5 className="text-muted mt-3">No brands found</h5>
                    <p className="text-muted">Start by adding your first brand</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="px-4 py-3">#</th>
                          <th scope="col" className="py-3">Brand Name</th>
                          <th scope="col" className="py-3">Category</th>
                          <th scope="col" className="py-3 text-end px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brands.map((brand, index) => (
                          <tr key={brand.brandId}>
                            <td className="px-4 py-3 text-muted">{index + 1}</td>
                            <td className="py-3">
                              <span className="fw-medium">{brand.brandName}</span>
                            </td>
                            <td className="py-3">
                              <span className="badge bg-info text-dark">{brand.categoryName}</span>
                            </td>
                            <td className="py-3 text-end px-4">
                              <div className="btn-group btn-group-sm" role="group">
                                <button 
                                  className="btn btn-outline-primary me-2"
                                  title="Edit"
                                  onClick={() => handleShowEditModal(brand)}
                                >
                                  <BsPencil className="me-1" />
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  title="Delete"
                                  onClick={() => handleShowDeleteModal(brand.brandId)}
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

      {/* Add Brand Modal */}
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
                  <h5 className="modal-title">Add New Brand</h5>
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
                      <label htmlFor="brandName" className="form-label">
                        Brand Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationError && !categoryId ? 'is-invalid' : ''}`}
                        id="brandName"
                        placeholder="Enter brand name"
                        value={brandName}
                        onChange={(e) => handleInputChange(e, 'brandName', false)}
                        autoFocus
                        disabled={submitting}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="categoryId" className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${validationError && !brandName ? 'is-invalid' : ''}`}
                        id="categoryId"
                        value={categoryId}
                        onChange={(e) => handleInputChange(e, 'categoryId', false)}
                        disabled={submitting}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {validationError && (
                      <div className="alert alert-danger" role="alert">
                        {validationError}
                      </div>
                    )}
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
                        'Add Brand'
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

      {/* Edit Brand Modal */}
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
                  <h5 className="modal-title">Edit Brand</h5>
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
                      <label htmlFor="editBrandName" className="form-label">
                        Brand Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${validationError && !editCategoryId ? 'is-invalid' : ''}`}
                        id="editBrandName"
                        placeholder="Enter brand name"
                        value={editBrandName}
                        onChange={(e) => handleInputChange(e, 'brandName', true)}
                        autoFocus
                        disabled={submitting}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="editCategoryId" className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${validationError && !editBrandName ? 'is-invalid' : ''}`}
                        id="editCategoryId"
                        value={editCategoryId}
                        onChange={(e) => handleInputChange(e, 'categoryId', true)}
                        disabled={submitting}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {validationError && (
                      <div className="alert alert-danger" role="alert">
                        {validationError}
                      </div>
                    )}
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
                        'Update Brand'
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
                  <p className="mb-0">Are you sure you want to delete this brand?</p>
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

export default ListBrand;
