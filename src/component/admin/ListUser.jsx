import React, { useState, useEffect } from 'react';
import { BsExclamationTriangleFill, BsFolderX, BsPersonCircle } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://localhost:7208/api/User/GetUser');

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log

      if (data.success && data.Data) {
        setUsers(data.Data);
      } else if (data.success && data.data) {
        // Fallback for lowercase 'data'
        setUsers(data.data);
      } else {
        setUsers([]);
        throw new Error(data.Message || data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      toast.error('Failed to load users', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
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
                <h2 className="fw-bold mb-1">Users</h2>
                <p className="text-muted mb-0">Manage all registered users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">All Users</h5>
                  <span className="badge bg-primary rounded-pill">{users.length}</span>
                </div>
              </div>
              <div className="card-body p-4">
                {users.length === 0 ? (
                  <div className="text-center py-5">
                    <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
                    <h5 className="text-muted mt-3">No users found</h5>
                    <p className="text-muted">No registered users at the moment</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="px-4 py-3">#</th>
                          <th scope="col" className="py-3">Profile</th>
                          <th scope="col" className="py-3">Username</th>
                          <th scope="col" className="py-3">Email</th>
                          <th scope="col" className="py-3">Registered Date</th>
                          <th scope="col" className="py-3">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user.UserId || user.userId || index}>
                            <td className="px-4 py-3 text-muted">{index + 1}</td>
                            <td className="py-3">
                              {user.ProfileImage || user.profileImage ? (
                                <img 
                                  src={`https://localhost:7208${user.ProfileImage || user.profileImage}`} 
                                  alt={user.Username || user.username}
                                  style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover', 
                                    borderRadius: '50%',
                                    border: '2px solid #e0e0e0'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'inline';
                                  }}
                                />
                              ) : null}
                              <BsPersonCircle 
                                style={{ 
                                  fontSize: '40px', 
                                  color: '#6c757d',
                                  display: (user.ProfileImage || user.profileImage) ? 'none' : 'inline'
                                }} 
                              />
                            </td>
                            <td className="py-3">
                              <span className="fw-medium">{user.Username || user.username || 'N/A'}</span>
                            </td>
                            <td className="py-3">
                              {user.Email || user.email ? (
                                <a href={`mailto:${user.Email || user.email}`} className="text-decoration-none">
                                  {user.Email || user.email}
                                </a>
                              ) : (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td className="py-3">
                              <small className="text-muted">
                                {formatDate(user.CreatedAt || user.createdAt)}
                              </small>
                            </td>
                            <td className="py-3">
                              <small className="text-muted">
                                {formatDate(user.UpdatedAt || user.updatedAt)}
                              </small>
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
    </>
  );
};

export default ListUser;
