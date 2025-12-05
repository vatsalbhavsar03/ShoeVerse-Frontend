import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart3, BsHeart, BsPersonGear, BsBoxArrowRight } from 'react-icons/bs';

const Header = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();
    loadUserData();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('wishlistUpdated', updateWishlistCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  const loadUserData = () => {
    try {
      setLoading(true);
      const userDataString = localStorage.getItem('user');

      if (userDataString) {
        const user = JSON.parse(userDataString);
        setUserData({
          username: user.name || 'User',
          email: user.email || '',
          profileImage: user.profileImage || ''
        });
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          fetchUserDataFromAPI(userId);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDataFromAPI = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7208/api/User/GetUserById/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();

      if (result.success && result.data) {
        const userData = {
          username: result.data.username,
          email: result.data.email,
          profileImage: result.data.profileImage
        };

        setUserData(userData);

        const user = {
          userId: result.data.userId,
          name: result.data.username,
          email: result.data.email,
          profileImage: result.data.profileImage
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error fetching user data from API:', error);
    }
  };

  const updateCartCount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) return;

    try {
      const response = await fetch(`https://localhost:7208/api/Cart/user/${user.userId}`);
      const data = await response.json();

      if (data.cartItems) {
        setCartCount(data.cartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(wishlist.length);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/user/profile');
    setShowUserMenu(false);
  };

  const getUserInitials = () => {
    const name = userData.username || 'User';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="header-wrapper sticky-top">
      <div className="main-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            {/* Logo */}
            <Link to="/user/userDashboard" className="logo">
              ShoeVerse
            </Link>

            {/* Right Side: Navigation + Actions */}
            <div className="header-right">
              {/* Navigation */}
              <nav className="main-nav">
                <Link to="/user/userDashboard" className="nav-item">Home</Link>
                <Link to="/user/shop" className="nav-item">Shop</Link>
                <Link to="/user/contact" className="nav-item">Contact</Link>
                <Link to="/user/orders" className="nav-item">Order</Link>
                
              </nav>

              {/* Actions */}
              <div className="header-actions">
                <Link to="/wishlist" className="action-icon" title="Wishlist">
                  <BsHeart size={24} />
                  {wishlistCount > 0 && (
                    <span className="badge-count">{wishlistCount}</span>
                  )}
                </Link>

                <Link to="/user/cart" className="action-icon" title="Cart">
                  <BsCart3 size={24} />
                  {cartCount > 0 && (
                    <span className="badge-count">{cartCount}</span>
                  )}
                </Link>

                <div className="user-dropdown-wrapper">
                  <button
                    className="action-icon user-icon-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    title="Account"
                  >
                    {loading ? (
                      <div className="header-user-avatar">
                        <span className="user-loading"></span>
                      </div>
                    ) : userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt={userData.username}
                        className="header-user-photo"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="header-user-avatar">
                        {getUserInitials()}
                      </div>
                    )}
                    {userData.profileImage && (
                      <div className="header-user-avatar" style={{ display: 'none' }}>
                        {getUserInitials()}
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="dropdown-overlay"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                          {userData.profileImage ? (
                            <>
                              <img
                                src={userData.profileImage}
                                alt={userData.username}
                                className="user-avatar-img"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              <div className="user-avatar" style={{ display: 'none' }}>
                                {getUserInitials()}
                              </div>
                            </>
                          ) : (
                            <div className="user-avatar">
                              {getUserInitials()}
                            </div>
                          )}
                          <div className="user-info">
                            <h6>{userData.username || 'User'}</h6>
                            <p>{userData.email || 'user@example.com'}</p>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        <button
                          className="dropdown-item-custom"
                          onClick={handleEditProfile}
                        >
                          <BsPersonGear size={18} />
                          <span>Edit Profile</span>
                        </button>

                        <button
                          className="dropdown-item-custom logout-item"
                          onClick={handleLogout}
                        >
                          <BsBoxArrowRight size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .header-wrapper {
          background: white;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          z-index: 1000;
        }

        .main-header {
          background: white;
        }

        .logo {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: -0.5px;
        }

        .logo:hover {
          opacity: 0.8;
        }

        /* NEW: Header Right Side Container */
        .header-right {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .main-nav {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .nav-item {
          color: #1f2937;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: color 0.3s;
          position: relative;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #6366f1;
          transition: width 0.3s;
        }

        .nav-item:hover {
          color: #6366f1;
        }

        .nav-item:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .action-icon {
          position: relative;
          color: #1f2937;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          transition: all 0.3s;
          padding: 10px;
          border-radius: 12px;
        }

        .action-icon:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          transform: translateY(-2px);
        }

        .badge-count {
          position: absolute;
          top: 2px;
          right: 2px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 7px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .header-user-photo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
          transition: all 0.3s;
        }

        .header-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.3s;
        }

        .user-loading {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .user-dropdown-wrapper {
          position: relative;
        }

        .user-icon-btn {
          padding: 0 !important;
        }

        .user-icon-btn:hover .header-user-photo,
        .user-icon-btn:hover .header-user-avatar {
          border-color: #6366f1;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .dropdown-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .user-avatar-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-info h6 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-info p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 0;
        }

        .dropdown-item-custom {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 24px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
          font-size: 15px;
          font-weight: 600;
        }

        .dropdown-item-custom:hover {
          background: #f9fafb;
          color: #6366f1;
        }

        .logout-item {
          color: #ef4444;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.05);
          color: #dc2626;
        }

        .dropdown-item-custom svg {
          flex-shrink: 0;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-right {
            gap: 15px;
          }

          .main-nav {
            gap: 15px;
          }

          .nav-item {
            font-size: 14px;
          }

          .header-actions {
            gap: 12px;
          }

          .logo {
            font-size: 24px;
          }

          .user-dropdown-menu {
            min-width: 260px;
            right: -10px;
          }
        }

        @media (max-width: 480px) {
          .main-nav {
            display: none;
          }

          .header-right {
            gap: 10px;
          }

          .header-actions {
            gap: 8px;
          }

          .action-icon {
            padding: 8px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;