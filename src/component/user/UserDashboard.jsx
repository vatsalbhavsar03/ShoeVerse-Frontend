import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import ProductCard from './ProductCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    gender: searchParams.get('gender') || '',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
    sortBy: 'featured'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchData = async () => {
  try {
    setLoading(true);
    await Promise.all([
      fetchProducts().catch(err => console.error('Products error:', err)),
      fetchCategories().catch(err => console.error('Categories error:', err)),
      fetchBrands().catch(err => console.error('Brands error:', err))
    ]);
  } catch (error) {
    console.error('Error in fetchData:', error);
    // Only show toast if ALL requests fail
    // toast.error('Failed to load data', { position: "top-right" });
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
    
    // API returns "brand" (singular) not "brands" (plural)
    if (data.success && data.brand) {
      setBrands(data.brand); // No isActive field in your API response
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};


  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === parseInt(filters.category));
    }

    if (filters.brand) {
      filtered = filtered.filter(p => p.brandId === parseInt(filters.brand));
    }

    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }

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
      search: '',
      sortBy: 'featured'
    });
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

      {/* Hero Banner */}
      {!filters.search && !filters.category && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Step Into Style</h1>
            <p className="hero-subtitle">
              Discover our premium collection of footwear for every occasion
            </p>
            <button className="hero-button" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
              Shop Now
            </button>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid px-4">
          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 filter-sidebar ${showFilters ? 'show' : ''}`}>
              <div className="filter-card">
                <div className="filter-header">
                  <h5>Filters</h5>
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


                {/* Brand */}
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

                {/* Gender */}
                <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  {['Men', 'Women', 'Unisex'].map(gender => (
                    <div key={gender} className="filter-radio">
                      <input
                        type="radio"
                        id={gender}
                        name="gender"
                        checked={filters.gender === gender}
                        onChange={() => setFilters({ ...filters, gender: filters.gender === gender ? '' : gender })}
                      />
                      <label htmlFor={gender}>{gender}</label>
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <label className="filter-label">Price Range</label>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      className="price-input"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <span>-</span>
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

            {/* Product Grid */}
            <div className="col-lg-9">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="toolbar-left">
                  <button
                    className="filter-toggle d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
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
                  <h4>No products found</h4>
                  <p>Try adjusting your filters</p>
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear Filters
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

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 80px 0;
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 20px;
          margin-bottom: 30px;
          opacity: 0.95;
        }

        .hero-button {
          background: white;
          color: #667eea;
          padding: 15px 40px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .hero-button:hover {
          transform: scale(1.05);
        }

        .main-content {
          padding: 30px 0 60px;
        }

        .filter-sidebar {
          padding-right: 20px;
        }

        .filter-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          position: sticky;
          top: 100px;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f3f4f6;
        }

        .filter-header h5 {
          margin: 0;
          font-weight: 700;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 25px;
        }

        .filter-label {
          display: block;
          font-weight: 600;
          margin-bottom: 10px;
          color: #1f2937;
        }

        .filter-select {
          width: 100%;
          padding: 10px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .filter-select:focus {
          outline: none;
          border-color: #6366f1;
        }

        .filter-radio {
          display: flex;
          align-items: center;
          padding: 8px 0;
        }

        .filter-radio input {
          margin-right: 10px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .filter-radio label {
          cursor: pointer;
          margin: 0;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .price-input {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .price-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .products-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .product-count {
          margin: 0;
          font-weight: 600;
          color: #1f2937;
        }

        .sort-select {
          padding: 10px 15px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .no-products {
          text-align: center;
          padding: 80px 20px;
        }

        .no-products h4 {
          font-size: 24px;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .no-products p {
          color: #9ca3af;
          margin-bottom: 25px;
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
            background: rgba(0,0,0,0.5);
            padding: 20px;
          }

          .filter-card {
            position: relative;
            top: 0;
            max-height: 90vh;
            overflow-y: auto;
          }

          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 15px;
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
        }
      `}</style>
    </Layout>
  );
};

export default UserDashboard;
