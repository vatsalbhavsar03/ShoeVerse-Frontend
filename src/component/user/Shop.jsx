import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import ProductCard from './ProductCard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsSearch, BsX, BsFunnel } from 'react-icons/bs';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBrands()
      ]);
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');
      if (!response.ok) throw new Error(`Products API error: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.products.filter(p => p.isActive));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Categories/GetCategory');
      if (!response.ok) throw new Error(`Categories API error: ${response.status}`);
      
      const data = await response.json();
      if (data.success && data.category) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Brands/GetBrands');
      if (!response.ok) throw new Error(`Brands API error: ${response.status}`);
      
      const data = await response.json();
      if (data.success && data.brand) {
        setBrands(data.brand);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === parseInt(filters.category));
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(p => p.brandId === parseInt(filters.brand));
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
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

      {/* Page Header */}
      <div className="shop-header">
        <div className="container-fluid px-4">
          <h1 className="page-title">Shop All Products</h1>
          <p className="page-subtitle">Discover our complete collection of premium footwear</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="container-fluid px-4">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <BsSearch size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                <BsX size={24} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid px-4">
          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 filter-sidebar ${showFilters ? 'show' : ''}`}>
              <div className="filter-card">
                <div className="filter-header">
                  <h5>
                    <BsFunnel size={18} style={{ marginRight: '8px' }} />
                    Filters
                  </h5>
                  <button className="clear-btn" onClick={clearFilters}>
                    Clear All
                  </button>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <select
                    className="filter-select"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="filter-group">
                  <label className="filter-label">Brand</label>
                  <select
                    className="filter-select"
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender Filter */}
                <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  <div className="radio-group">
                    {['Men', 'Women', 'Unisex'].map(gender => (
                      <label key={gender} className="filter-radio">
                        <input
                          type="radio"
                          name="gender"
                          checked={filters.gender === gender}
                          onChange={() => setFilters({ ...filters, gender: filters.gender === gender ? '' : gender })}
                        />
                        <span>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-group">
                  <label className="filter-label">Price Range</label>
                  <div className="price-range-container">
                    <div className="price-input-wrapper">
                      <input
                        type="number"
                        placeholder="Min"
                        className="price-input"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      />
                    </div>
                    <span className="price-separator">-</span>
                    <div className="price-input-wrapper">
                      <input
                        type="number"
                        placeholder="Max"
                        className="price-input"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="col-lg-9">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <button
                    className="filter-toggle d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <BsFunnel size={16} style={{ marginRight: '6px' }} />
                    Filters
                  </button>
                  <h5 className="product-count">
                    {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                  </h5>
                </div>
                <select
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">🔍</div>
                  <h4>No products found</h4>
                  <p>Try adjusting your filters or search query</p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.productId} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="mobile-filter-overlay" onClick={() => setShowFilters(false)} />
      )}

      <style>{`
        .shop-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 50px 0;
          text-align: center;
          color: white;
          margin-bottom: 0;
        }

        .page-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .page-subtitle {
          font-size: 18px;
          margin: 0;
          opacity: 0.95;
        }

        .search-section {
          background: white;
          padding: 30px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .search-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 16px 50px 16px 52px;
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 15px;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.3s;
        }

        .clear-search:hover {
          background: #e5e7eb;
          color: #1f2937;
        }

        .main-content {
          padding: 40px 0 80px;
          background: #f9fafb;
        }

        .filter-sidebar {
          padding-right: 20px;
        }

        .filter-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          position: sticky;
          top: 100px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 2px solid #f3f4f6;
        }

        .filter-header h5 {
          margin: 0;
          font-weight: 700;
          font-size: 18px;
          color: #1f2937;
          display: flex;
          align-items: center;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.05);
        }

        .filter-group {
          margin-bottom: 28px;
        }

        .filter-label {
          display: block;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1f2937;
          font-size: 15px;
        }

        .filter-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-radio {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          margin: 0;
        }

        .filter-radio:hover {
          background: #f9fafb;
        }

        .filter-radio input {
          margin-right: 12px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #6366f1;
        }

        .filter-radio span {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        /* FIXED PRICE RANGE STYLES */
        .price-range-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-input-wrapper {
          flex: 1;
          position: relative;
        }

        .price-input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
          background: white;
          box-sizing: border-box;
        }

        .price-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .price-input::placeholder {
          color: #9ca3af;
          font-weight: 400;
        }

        /* Remove number input arrows */
        .price-input::-webkit-outer-spin-button,
        .price-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .price-input[type=number] {
          -moz-appearance: textfield;
        }

        .price-separator {
          font-weight: 700;
          color: #6b7280;
          font-size: 16px;
          flex-shrink: 0;
        }

        .products-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .filter-toggle {
          padding: 10px 20px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          background: #4f46e5;
        }

        .product-count {
          margin: 0;
          font-weight: 700;
          color: #1f2937;
          font-size: 16px;
        }

        .sort-select {
          padding: 12px 18px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          background: white;
        }

        .sort-select:focus {
          outline: none;
          border-color: #6366f1;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 28px;
        }

        .no-products {
          text-align: center;
          padding: 100px 20px;
          background: white;
          border-radius: 16px;
        }

        .no-products-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .no-products h4 {
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .no-products p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .mobile-filter-overlay {
          display: none;
        }

        @media (max-width: 991px) {
          .filter-sidebar {
            display: none;
          }

          .filter-sidebar.show {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            padding: 20px;
            background: white;
            overflow-y: auto;
          }

          .mobile-filter-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
          }

          .filter-card {
            position: relative;
            top: 0;
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .page-subtitle {
            font-size: 16px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }

          .products-toolbar {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .toolbar-left {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            padding: 14px 48px 14px 48px;
            font-size: 14px;
          }

          .price-input {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Shop;