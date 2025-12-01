import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsTrash, BsStarFill, BsStar } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Review/GetAllReviews');

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <BsStarFill key={index} className="text-warning" />
          ) : (
            <BsStar key={index} className="text-warning" />
          )
        ))}
        <span className="ms-2 text-muted small">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShowDeleteModal = (reviewId) => {
    setDeleteReviewId(reviewId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteReviewId(null);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Review/DeleteReview/${deleteReviewId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        toast.success('Review deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseDeleteModal();
        fetchReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete review', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while deleting review', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
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
                <h2 className="fw-bold mb-1">Reviews</h2>
                <p className="text-muted mb-0">Manage all product reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">All Reviews</h5>
                  <span className="badge bg-primary rounded-pill">{reviews.length}</span>
                </div>
              </div>
              <div className="card-body p-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-5">
                    <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
                    <h5 className="text-muted mt-3">No reviews found</h5>
                    <p className="text-muted">Reviews will appear here once customers submit them</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="px-4 py-3">#</th>
                          <th scope="col" className="py-3">Product ID</th>
                          <th scope="col" className="py-3">User</th>
                          <th scope="col" className="py-3">Rating</th>
                          <th scope="col" className="py-3">Review</th>
                          <th scope="col" className="py-3">Date</th>
                          <th scope="col" className="py-3 text-end px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map((review, index) => (
                          <tr key={review.reviewId}>
                            <td className="px-4 py-3 text-muted">{index + 1}</td>
                            <td className="py-3">
                              <span className="badge bg-secondary">#{review.productId}</span>
                            </td>
                            <td className="py-3">
                              <span className="fw-medium">{review.userName || 'Anonymous'}</span>
                              <br />
                              <small className="text-muted">ID: {review.userId}</small>
                            </td>
                            <td className="py-3">
                              {renderStars(review.rating)}
                            </td>
                            <td className="py-3" style={{ maxWidth: '300px' }}>
                              <div className="text-truncate" title={review.reviewText}>
                                {review.reviewText || 'No comment'}
                              </div>
                            </td>
                            <td className="py-3">
                              <small className="text-muted">{formatDate(review.createdAt)}</small>
                            </td>
                            <td className="py-3 text-end px-4">
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                title="Delete"
                                onClick={() => handleShowDeleteModal(review.reviewId)}
                              >
                                <BsTrash className="me-1" />
                                Delete
                              </button>
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
                  <p className="mb-0">Are you sure you want to delete this review?</p>
                  <p className="text-muted mb-0 mt-2">This action cannot be undone.</p>
                </div>
                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={submitting}
                    style={{ minWidth: '120px', flex: '0 0 auto' }}
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

export default AdminReviews;
