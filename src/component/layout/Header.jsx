import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsSearch, BsCart3, BsHeart, BsPerson, BsPersonGear, BsBoxArrowRight, BsChevronDown } from 'react-icons/bs';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false); // ADD THIS
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Categories/GetCategory');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.category) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/user/userDashboard?search=${searchQuery}`);
    }
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
      {/* Main Header */}
      <div className="main-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            <Link to="/user/userDashboard" className="logo">
              ShoeVerse
            </Link>

            <form onSubmit={handleSearch} className="search-form mx-4 flex-grow-1" style={{ maxWidth: '600px' }}>
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search shoes, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <BsSearch size={20} />
                </button>
              </div>
            </form>

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
                        <span>Edit User Details</span>
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

      {/* Navigation Bar - UPDATED */}
      <nav className="navigation-bar">
        <div className="container-fluid px-4">
          <ul className="nav-menu">
            <li><Link to="/user/userDashboard" className="nav-link">Home</Link></li>

            {/* Custom Categories Dropdown */}
            <li
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button
                className="nav-link nav-dropdown-btn"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                Categories <BsChevronDown size={12} style={{ marginLeft: '4px' }} />
              </button>

              {showCategoryMenu && categories.length > 0 && (
                <div className="nav-dropdown-menu">
                  {categories.map(cat => (
                    <Link
                      key={cat.categoryId}
                      className="nav-dropdown-item"
                      to={`/user/userDashboard?category=${cat.categoryId}`}
                      onClick={() => setShowCategoryMenu(false)}
                    >
                      {cat.categoryName}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li><Link to="/user/userDashboard?gender=Men" className="nav-link">Men</Link></li>
            <li><Link to="/user/userDashboard?gender=Women" className="nav-link">Women</Link></li>
            <li><Link to="/user/userDashboard?gender=Unisex" className="nav-link">Unisex</Link></li>
            <li><Link to="/user/userDashboard?sale=true" className="nav-link sale-link">Sale</Link></li>
          </ul>
        </div>
      </nav>

      <style>{`
        .header-wrapper {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .main-header {
          background: white;
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #6366f1;
          text-decoration: none;
          white-space: nowrap;
        }

        .logo:hover {
          color: #4f46e5;
        }

        .search-container {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 15px;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-button {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s;
        }

        .search-button:hover {
          background: #4f46e5;
        }

        .header-actions {
          display: flex;
          gap: 25px;
          align-items: center;
        }

        .action-icon {
          position: relative;
          color: #1f2937;
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.3s;
          padding: 8px;
          border-radius: 8px;
        }

        .action-icon:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        .badge-count {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .header-user-photo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }

        .header-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-loading {
          width: 20px;
          height: 20px;
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
          position: relative;
          padding: 0 !important;
        }

        .user-icon-btn:hover .header-user-photo,
        .user-icon-btn:hover .header-user-avatar {
          border-color: #6366f1;
          transform: scale(1.05);
          transition: all 0.3s;
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
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 280px;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
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
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-avatar-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f3f4f6;
          flex-shrink: 0;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 18px;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-info h6 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-info p {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
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
          gap: 12px;
          padding: 14px 20px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          color: #374151;
          font-size: 15px;
          font-weight: 500;
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

        .navigation-bar {
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 5px;
          justify-content: center;
          align-items: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s;
          border-radius: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-link:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.05);
        }

        /* Category Dropdown Styles */
        .nav-dropdown-wrapper {
          position: relative;
        }

        .nav-dropdown-btn {
          display: flex;
          align-items: center;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          padding: 8px 0;
          z-index: 1000;
          animation: dropdownSlide 0.2s ease-out;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-dropdown-item {
          display: block;
          padding: 10px 20px;
          color: #374151;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-dropdown-item:hover {
          background: #f3f4f6;
          color: #6366f1;
        }

        .sale-link {
          color: #ef4444;
          font-weight: 600;
        }

        .sale-link:hover {
          background: rgba(239, 68, 68, 0.05);
        }

        @media (max-width: 768px) {
          .search-form {
            display: none;
          }
          
          .nav-menu {
            flex-wrap: wrap;
            gap: 2px;
          }
          
          .nav-link {
            padding: 10px 12px;
            font-size: 14px;
          }

          .header-actions {
            gap: 15px;
          }

          .user-dropdown-menu {
            min-width: 260px;
            right: -10px;
          }

          .nav-dropdown-menu {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
