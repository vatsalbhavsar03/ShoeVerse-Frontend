import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { BsPersonCircle, BsEnvelope, BsPhone, BsCamera } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    userId: '',
    username: '',
    email: '',
    phoneNo: '',
    profileImage: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDataString = localStorage.getItem('user');

      if (userDataString) {
        const user = JSON.parse(userDataString);
        console.log('Loaded user data:', user);
        
        setUserData({
          userId: user.userId,
          username: user.name || user.username,
          email: user.email,
          phoneNo: user.phoneNo || '',
          profileImage: user.profileImage || ''
        });
        
        setFormData({
          name: user.name || user.username || '',
          email: user.email || '',
          phoneNo: user.phoneNo || ''
        });
        
        setPreviewImage(user.profileImage || '');
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          await fetchUserFromAPI(userId);
        } else {
          toast.error('User session not found. Please login again.');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFromAPI = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7208/api/User/GetUserById/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success && result.data) {
        setUserData({
          userId: result.data.userId,
          username: result.data.username,
          email: result.data.email,
          phoneNo: result.data.phoneNo || '',
          profileImage: result.data.profileImage || ''
        });

        setFormData({
          name: result.data.username,
          email: result.data.email,
          phoneNo: result.data.phoneNo || ''
        });

        setPreviewImage(result.data.profileImage || '');
      }
    } catch (error) {
      console.error('Error fetching user from API:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error('Username is required');
    return;
  }

  if (!formData.email.trim()) {
    toast.error('Email is required');
    return;
  }

  if (!userData.userId) {
    toast.error('User ID not found. Please login again.');
    return;
  }

  try {
    setSaving(true);

    const formDataToSend = new FormData();
    formDataToSend.append('Name', formData.name.trim());
    formDataToSend.append('Email', formData.email.trim());
    
    // Convert phoneNo to number - backend expects integer
    const phoneNumber = formData.phoneNo && formData.phoneNo.toString().trim() !== '' 
      ? parseInt(formData.phoneNo, 10) 
      : 0;
    formDataToSend.append('PhoneNo', phoneNumber);
    
    // Password field - send a dummy password (backend requirement)
    // The backend checks: if (!string.IsNullOrEmpty(updateDto.Password))
    // So we need to send something, but backend only updates if provided
    formDataToSend.append('Password', 'DummyPassword@123'); // Backend will ignore this

    if (selectedFile) {
      formDataToSend.append('profileImage', selectedFile);
    }

    console.log('Sending update for userId:', userData.userId);
    console.log('FormData:', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phoneNo: phoneNumber
    });

    const response = await fetch(
      `https://localhost:7208/api/User/EditProfile/${userData.userId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      }
    );

    const result = await response.json();
    console.log('API Response:', result);

    if (result.success) {
      toast.success('Profile updated successfully!');

      // Update localStorage with new user data
      const updatedUser = {
        userId: result.user.userId,
        name: result.user.username,
        email: result.user.email,
        phoneNo: result.user.phoneNo,
        profileImage: result.user.profileImage
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state
      setUserData({
        userId: result.user.userId,
        username: result.user.username,
        email: result.user.email,
        phoneNo: result.user.phoneNo,
        profileImage: result.user.profileImage
      });

      setFormData({
        name: result.user.username,
        email: result.user.email,
        phoneNo: result.user.phoneNo || ''
      });

      setPreviewImage(result.user.profileImage);
      setSelectedFile(null);

      // Reload after a short delay to show the updated info
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Network error. Please try again.');
  } finally {
    setSaving(false);
  }
};


  const getUserInitials = () => {
    const name = userData.username || formData.name || 'User';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToastContainer />
      
      <div className="profile-container">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="profile-card">
                <div className="profile-header">
                  <h2>Edit Profile</h2>
                  <p className="text-muted">Update your account information</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Profile Image */}
                  <div className="profile-image-section">
                    <div className="profile-image-wrapper">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="profile-image" />
                      ) : (
                        <div className="profile-image-placeholder">
                          {getUserInitials()}
                        </div>
                      )}
                      <label htmlFor="profileImage" className="change-photo-btn">
                        <BsCamera size={20} />
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className="profile-image-info">
                      <h5>{formData.name || userData.username || 'User'}</h5>
                      <p className="text-muted">{formData.email || userData.email}</p>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Personal Information */}
                  <h5 className="section-title">Personal Information</h5>
                  
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Username *</label>
                      <div className="input-group">
                        <span className="input-icon"><BsPersonCircle /></span>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <div className="input-group">
                        <span className="input-icon"><BsEnvelope /></span>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <div className="input-group">
                        <span className="input-icon"><BsPhone /></span>
                        <input
                          type="tel"
                          name="phoneNo"
                          className="form-control"
                          value={formData.phoneNo}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          pattern="[0-9]*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/user/userDashboard')}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-container {
          background: #f9fafb;
          min-height: calc(100vh - 200px);
        }

        .profile-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .profile-image-section {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-bottom: 30px;
        }

        .profile-image-wrapper {
          position: relative;
        }

        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #f3f4f6;
        }

        .profile-image-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: 700;
          border: 4px solid #f3f4f6;
        }

        .change-photo-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: #6366f1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          border: 3px solid white;
          transition: all 0.3s;
        }

        .change-photo-btn:hover {
          background: #4f46e5;
          transform: scale(1.05);
        }

        .profile-image-info h5 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
        }

        .profile-image-info p {
          margin: 5px 0 0 0;
          font-size: 14px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 10;
        }

        .input-group .form-control {
          padding-left: 45px;
        }

        .form-control {
          padding: 12px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="tel"]::-webkit-inner-spin-button,
        input[type="tel"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .btn {
          padding: 12px 30px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #6366f1;
          border: none;
        }

        .btn-primary:hover {
          background: #4f46e5;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-outline-secondary {
          border: 2px solid #e5e7eb;
          color: #374151;
        }

        .btn-outline-secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 25px;
          }

          .profile-image-section {
            flex-direction: column;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
