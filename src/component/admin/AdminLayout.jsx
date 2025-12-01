import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdmiDashBoard from './AdmiDashBoard';
import ListCategory from './ListCategory';
import ListBrand from './ListBrand';
import ListProduct from './ListProduct';
import ListOrder from './ListOrder';
import ListUser from './ListUser';
import AdminReviews from './AdminReviews';

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({ 
    name: '', 
    profile: '', 
    userId: null,
    email: '',
    phoneNo: ''
  });
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
   
    
    if (!storedUser || !token) {
      toast.error('Please login first', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate('/');
      return;
    }
    
    try {
      const user = JSON.parse(storedUser);

      const userId = user.userId || user.UserId || user.id || user.ID || null;
      const userName = user.name || user.username || user.Username || user.userName || 'Admin';
      const userEmail = user.email || user.Email || '';
      const userPhone = user.phoneNo || user.PhoneNo || user.phone || user.Phone || '';
      

      let imageUrl = user.profileImage || user.ProfileImage || '';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://localhost:7208/${imageUrl.replace(/^\/+/, '')}`;
      }

      setAdminData({
        name: userName,
        profile: imageUrl,
        userId: userId,
        email: userEmail,
        phoneNo: userPhone
      });

      setFormData({
        name: userName,
        email: userEmail,
        phoneNo: userPhone.toString(),
        password: ''
      });
      
      setImagePreview(imageUrl);
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Session error. Please login again.', {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.clear();
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roleId');
    toast.info('Logged out successfully', {
      position: "top-right",
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      toast.success('Image selected successfully', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    
    if (!adminData.userId) {
      toast.error('User session expired. Please login again.', {
        position: "top-right",
        autoClose: 3000,
      });
      localStorage.clear();
      navigate('/');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    
    formDataToSend.append('Name', formData.name.trim());
    formDataToSend.append('Email', formData.email.trim());
    
    const phoneNumber = formData.phoneNo ? parseInt(formData.phoneNo, 10) : 0;
    formDataToSend.append('PhoneNo', phoneNumber);
    
    if (formData.password && formData.password.trim() !== '') {
      formDataToSend.append('Password', formData.password.trim());
    }
    
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    }
    for (let pair of formDataToSend.entries()) {
    }

    const apiUrl = `https://localhost:7208/api/User/EditProfile/${adminData.userId}`;

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formDataToSend
      });


      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = {
          userId: data.user.userId,
          name: data.user.username,
          email: data.user.email,
          phoneNo: data.user.phoneNo,
          profileImage: data.user.profileImage
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success('Profile updated successfully! 🎉', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setShowModal(false);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to update profile', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const MenuItem = ({ icon, label, page, onClick, badge }) => (
    <button
      className={`menu-item d-flex align-items-center justify-content-between btn w-100 text-start position-relative overflow-hidden ${
        currentPage === page ? 'active' : ''
      }`}
      onClick={() => {
        if (onClick) return onClick();
        setCurrentPage(page);
      }}
      style={{
        padding: sidebarOpen ? '12px 16px' : '12px',
        marginBottom: '4px',
        borderRadius: '8px',
        border: 'none',
        background: currentPage === page ? 'rgba(13, 110, 253, 0.1)' : 'transparent',
        color: currentPage === page ? '#0d6efd' : '#dee2e6',
        fontWeight: currentPage === page ? '600' : '400',
        transition: 'all 0.2s ease',
        fontSize: '0.95rem',
      }}
      onMouseEnter={(e) => {
        if (currentPage !== page) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (currentPage !== page) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <div className="d-flex align-items-center gap-3">
        <span style={{ fontSize: '1.3rem', minWidth: '24px' }}>{icon}</span>
        {sidebarOpen && <span>{label}</span>}
      </div>
      {badge && sidebarOpen && (
        <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="d-flex vh-100" style={{ background: '#f8f9fa' }}>
      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Sidebar */}
      <aside
        className="d-flex flex-column justify-content-between position-relative"
        style={{
          width: sidebarOpen ? '280px' : '80px',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'linear-gradient(180deg, #1a1d29 0%, #2d3142 100%)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
          zIndex: 1000,
        }}
      >
        <div>
          <div
            className="d-flex align-items-center justify-content-between p-3"
            style={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              minHeight: '72px',
            }}
          >
            {sidebarOpen && (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    fontSize: '1.5rem',
                  }}
                >
                  👟
                </div>
                <h2 className="m-0" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>
                  ShoeVerse
                </h2>
              </div>
            )}
            <button
              className="btn p-2 d-flex align-items-center justify-content-center"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                width: '36px',
                height: '36px',
                transition: 'all 0.2s ease',
              }}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>

          <nav className="p-3">
            <MenuItem icon="📊" label="Dashboard" page="dashboard" />
            <MenuItem icon="👥" label="Customers" page="customers"/>
            <MenuItem icon="📂" label="Category" page="category" />
            <MenuItem icon="🏷️" label="Brand" page="brand" />
            <MenuItem icon="📦" label="Products" page="products" />
            <MenuItem icon="🛒" label="Orders" page="orders" />
            <MenuItem icon="⭐" label="Reviews" page="reviews" />
          </nav>
        </div>

        <div className="p-3">
          <button
            className="btn w-100 d-flex align-items-center gap-3 text-start"
            onClick={handleLogout}
            style={{
              padding: sidebarOpen ? '12px 16px' : '12px',
              borderRadius: '8px',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#ff6b6b',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header
          className="py-3 px-4 d-flex justify-content-between align-items-center"
          style={{
            background: '#fff',
            borderBottom: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            minHeight: '72px',
          }}
        >
          <div>
            <h1 className="mb-1" style={{ fontSize: '1.75rem', fontWeight: '700', color: '#212529' }}>
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
            <p className="mb-0" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
              Manage your online shoe store efficiently
            </p>
          </div>

          <div className="position-relative">
            <button
              className="d-flex align-items-center gap-3 btn border-0 position-relative"
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                padding: '8px 16px',
                borderRadius: '50px',
                background: '#f8f9fa',
                transition: 'all 0.2s ease',
              }}
            >
              {adminData.profile ? (
                <img
                  src={adminData.profile}
                  alt="profile"
                  className="rounded-circle"
                  style={{
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                    border: '2px solid #0d6efd',
                  }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                  }}
                >
                  {adminData.name ? adminData.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <div className="d-none d-md-block text-start">
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#212529' }}>
                  {adminData.name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Administrator</div>
              </div>

              <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>▼</span>
            </button>

            {profileOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border-0 rounded shadow"
                style={{
                  minWidth: '220px',
                  zIndex: 1001,
                  animation: 'fadeIn 0.2s ease',
                  overflow: 'hidden',
                }}
              >
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-3 px-4"
                  onClick={() => {
                    setShowModal(true);
                    setProfileOpen(false);
                  }}
                  style={{
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  <span>⚙️</span> Edit Profile
                </button>
                <hr className="my-0" style={{ opacity: 0.1 }} />
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-3 px-4"
                  onClick={handleLogout}
                  style={{
                    fontSize: '0.9rem',
                    color: '#dc3545',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: 'transparent',
                  }}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto p-4" style={{ background: '#f8f9fa' }}>
          {currentPage === 'dashboard' && <AdmiDashBoard />}
          {currentPage === 'customers' && <ListUser />}
          {currentPage === 'category' && <ListCategory />}
          {currentPage === 'brand' && <ListBrand />}
          {currentPage === 'products' && <ListProduct />}
          {currentPage === 'orders' && <ListOrder />}
          {currentPage === 'reviews' && <AdminReviews />}
        </main>
      </div>

      {/* Profile Edit Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target.classList.contains('modal')) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ borderRadius: '15px', border: 'none' }}>
              <div
                className="modal-header"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: '15px 15px 0 0',
                }}
              >
                <h5 className="modal-title fw-bold">
                  <span className="me-2">✏️</span>Edit Admin Profile
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="modal-body p-4">
                  <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="rounded-circle"
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            border: '4px solid #667eea',
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            fontSize: '3rem',
                            fontWeight: '600',
                          }}
                        >
                          {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <label
                        htmlFor="profileImageInput"
                        className="position-absolute"
                        style={{
                          bottom: '5px',
                          right: '5px',
                          background: '#667eea',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '3px solid #fff',
                        }}
                      >
                        📷
                      </label>
                      <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <p className="mt-2 text-muted small">Click camera icon to change profile picture</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <span className="me-2">👤</span>Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        style={{ borderRadius: '8px', padding: '10px 15px' }}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <span className="me-2">📧</span>Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        style={{ borderRadius: '8px', padding: '10px 15px' }}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <span className="me-2">📱</span>Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phoneNo}
                        onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                        placeholder="Enter phone number"
                        style={{ borderRadius: '8px', padding: '10px 15px' }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <span className="me-2">🔒</span>New Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Leave blank to keep current"
                        style={{ borderRadius: '8px', padding: '10px 15px' }}
                      />
                      <small className="text-muted">Leave blank if you don't want to change password</small>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid #e9ecef', padding: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    style={{ borderRadius: '8px', padding: '10px 25px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 25px',
                      fontWeight: '600',
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <span className="me-2">💾</span>Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .menu-item:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }

        main::-webkit-scrollbar {
          width: 8px;
        }

        main::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        main::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        main::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .modal.show {
          display: block !important;
        }

        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        /* Custom Toastify Styles */
        .Toastify__toast {
          border-radius: 10px;
          font-family: inherit;
          font-weight: 500;
        }

        .Toastify__toast--success {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .Toastify__toast--error {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .Toastify__toast--info {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
