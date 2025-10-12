import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmiDashBoard from './AdmiDashBoard';
import ListCategory from './ListCategory';
import ListBrand from './ListBrand';
import ListProduct from './ListProduct';
import ListOrder from './ListOrder';
import ListUser from './ListUser';


function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const MenuItem = ({ icon, label, page, onClick }) => (
    <button
      className={`d-flex align-items-center gap-2 btn w-100 text-start ${
        currentPage === page ? 'btn-primary text-white' : 'btn-dark text-secondary'
      }`}
      onClick={() => {
        if (onClick) return onClick();
        setCurrentPage(page);
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <aside
        className={`d-flex flex-column justify-content-between bg-dark text-white transition-width`}
        style={{ width: sidebarOpen ? '256px' : '80px', transition: 'width 0.3s' }}
      >
        <div>
          {/* Brand & Toggle */}
          <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
            {sidebarOpen && <h2 className="h5 m-0">ShoeVerse</h2>}
            <button
              className="btn btn-dark p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Menu */}
          <nav className="d-flex flex-column p-2 gap-1">
            <MenuItem icon="📊" label="Dashboard" page="dashboard" />
            <MenuItem icon="📂" label="Category" page="category" />
            <MenuItem icon="🏷️" label="Brand" page="brand" />
            <MenuItem icon="📦" label="Products" page="products" />
            <MenuItem icon="🛒" label="Orders" page="orders" />
            <MenuItem icon="👥" label="Customers" page="customers" />
         
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-2">
          <MenuItem icon="🚪" label="Logout" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header */}
        <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-1 text-dark">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
            <p className="text-muted mb-0">Manage your online shoe store</p>
          </div>

          {/* Profile Section */}
          <div className="position-relative">
            <button
              className="d-flex align-items-center gap-2 btn btn-light border"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>
                U
              </span>
              <span className="d-none d-md-inline">Admin</span>
              <span>▼</span>
            </button>

            {profileOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                style={{ minWidth: '150px', zIndex: 100 }}
              >
                <button className="dropdown-item w-100 text-start" onClick={() => setCurrentPage('settings')}>
                  ⚙️ Settings
                </button>
                <button className="dropdown-item w-100 text-start" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow-1 overflow-auto p-4">
          {currentPage === 'dashboard' && <AdmiDashBoard />}
          {currentPage === 'category' && <ListCategory />}
          {currentPage === 'brand' && <ListBrand />}
          {currentPage === 'products' && <ListProduct />}
          {currentPage === 'orders' && <ListOrder />}
          {currentPage === 'customers' && <ListUser />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
