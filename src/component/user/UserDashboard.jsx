// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import Layout from '../layout/Layout';
// import ProductCard from './ProductCard';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);

//   const [filters, setFilters] = useState({
//     category: searchParams.get('category') || '',
//     brand: '',
//     gender: searchParams.get('gender') || '',
//     minPrice: '',
//     maxPrice: '',
//     search: searchParams.get('search') || '',
//     sortBy: 'featured'
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [products, filters]);

//   const fetchData = async () => {
//   try {
//     setLoading(true);
//     await Promise.all([
//       fetchProducts().catch(err => console.error('Products error:', err)),
//       fetchCategories().catch(err => console.error('Categories error:', err)),
//       fetchBrands().catch(err => console.error('Brands error:', err))
//     ]);
//   } catch (error) {
//     console.error('Error in fetchData:', error);
//     // Only show toast if ALL requests fail
//     // toast.error('Failed to load data', { position: "top-right" });
//   } finally {
//     setLoading(false);
//   }
// };

// const fetchProducts = async () => {
//   try {
//     const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');
//     if (!response.ok) throw new Error(`Products API error: ${response.status}`);
    
//     const data = await response.json();
//     if (data.success) {
//       setProducts(data.products.filter(p => p.isActive));
//     }
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     throw error;
//   }
// };

// const fetchCategories = async () => {
//   try {
//     const response = await fetch('https://localhost:7208/api/Categories/GetCategory');
//     if (!response.ok) throw new Error(`Categories API error: ${response.status}`);
    
//     const data = await response.json();
//     if (data.success && data.category) {
//       setCategories(data.category);
//     }
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };

// const fetchBrands = async () => {
//   try {
//     const response = await fetch('https://localhost:7208/api/Brands/GetBrands');
//     if (!response.ok) throw new Error(`Brands API error: ${response.status}`);
    
//     const data = await response.json();
    
//     // API returns "brand" (singular) not "brands" (plural)
//     if (data.success && data.brand) {
//       setBrands(data.brand); // No isActive field in your API response
//     }
//   } catch (error) {
//     console.error('Error fetching brands:', error);
//     throw error;
//   }
// };


//   const applyFilters = () => {
//     let filtered = [...products];

//     if (filters.search) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
//         p.description.toLowerCase().includes(filters.search.toLowerCase())
//       );
//     }

//     if (filters.category) {
//       filtered = filtered.filter(p => p.categoryId === parseInt(filters.category));
//     }

//     if (filters.brand) {
//       filtered = filtered.filter(p => p.brandId === parseInt(filters.brand));
//     }

//     if (filters.gender) {
//       filtered = filtered.filter(p => p.gender === filters.gender);
//     }

//     if (filters.minPrice) {
//       filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
//     }

//     if (filters.maxPrice) {
//       filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
//     }

//     // Sorting
//     switch (filters.sortBy) {
//       case 'price-low':
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high':
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case 'name':
//         filtered.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(filtered);
//   };

//   const clearFilters = () => {
//     setFilters({
//       category: '',
//       brand: '',
//       gender: '',
//       minPrice: '',
//       maxPrice: '',
//       search: '',
//       sortBy: 'featured'
//     });
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
//           <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <ToastContainer />

//       {/* Hero Banner */}
//       {!filters.search && !filters.category && (
//         <section className="hero-section">
//           <div className="hero-content">
//             <h1 className="hero-title">Step Into Style</h1>
//             <p className="hero-subtitle">
//               Discover our premium collection of footwear for every occasion
//             </p>
//             <button className="hero-button" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
//               Shop Now
//             </button>
//           </div>
//         </section>
//       )}

//       {/* Main Content */}
//       <div className="main-content">
//         <div className="container-fluid px-4">
//           <div className="row">
//             {/* Sidebar Filters */}
//             <div className={`col-lg-3 filter-sidebar ${showFilters ? 'show' : ''}`}>
//               <div className="filter-card">
//                 <div className="filter-header">
//                   <h5>Filters</h5>
//                   <button className="clear-btn" onClick={clearFilters}>
//                     Clear All
//                   </button>
//                 </div>

//                 {/* Category Filter */}
//                 <div className="filter-group">
//                   <label className="filter-label">Category</label>
//                   <select
//                     className="filter-select"
//                     value={filters.category}
//                     onChange={(e) => setFilters({ ...filters, category: e.target.value })}
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map(cat => (
//                       <option key={cat.categoryId} value={cat.categoryId}>
//                         {cat.categoryName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>


//                 {/* Brand */}
//                 <div className="filter-group">
//                   <label className="filter-label">Brand</label>
//                   <select
//                     className="filter-select"
//                     value={filters.brand}
//                     onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
//                   >
//                     <option value="">All Brands</option>
//                     {brands.map(brand => (
//                       <option key={brand.brandId} value={brand.brandId}>
//                         {brand.brandName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Gender */}
//                 <div className="filter-group">
//                   <label className="filter-label">Gender</label>
//                   {['Men', 'Women', 'Unisex'].map(gender => (
//                     <div key={gender} className="filter-radio">
//                       <input
//                         type="radio"
//                         id={gender}
//                         name="gender"
//                         checked={filters.gender === gender}
//                         onChange={() => setFilters({ ...filters, gender: filters.gender === gender ? '' : gender })}
//                       />
//                       <label htmlFor={gender}>{gender}</label>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price Range */}
//                 <div className="filter-group">
//                   <label className="filter-label">Price Range</label>
//                   <div className="price-inputs">
//                     <input
//                       type="number"
//                       placeholder="Min"
//                       className="price-input"
//                       value={filters.minPrice}
//                       onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                     />
//                     <span>-</span>
//                     <input
//                       type="number"
//                       placeholder="Max"
//                       className="price-input"
//                       value={filters.maxPrice}
//                       onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Product Grid */}
//             <div className="col-lg-9">
//               {/* Toolbar */}
//               <div className="products-toolbar">
//                 <div className="toolbar-left">
//                   <button
//                     className="filter-toggle d-lg-none"
//                     onClick={() => setShowFilters(!showFilters)}
//                   >
//                     Filters
//                   </button>
//                   <h5 className="product-count">
//                     {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
//                   </h5>
//                 </div>
//                 <select
//                   className="sort-select"
//                   value={filters.sortBy}
//                   onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
//                 >
//                   <option value="featured">Sort by: Featured</option>
//                   <option value="price-low">Price: Low to High</option>
//                   <option value="price-high">Price: High to Low</option>
//                   <option value="name">Name: A-Z</option>
//                 </select>
//               </div>

//               {/* Products Grid */}
//               {filteredProducts.length === 0 ? (
//                 <div className="no-products">
//                   <h4>No products found</h4>
//                   <p>Try adjusting your filters</p>
//                   <button className="btn btn-primary" onClick={clearFilters}>
//                     Clear Filters
//                   </button>
//                 </div>
//               ) : (
//                 <div className="products-grid">
//                   {filteredProducts.map(product => (
//                     <ProductCard key={product.productId} product={product} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .hero-section {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 80px 0;
//           text-align: center;
//           color: white;
//           margin-bottom: 40px;
//         }

//         .hero-title {
//           font-size: 48px;
//           font-weight: 700;
//           margin-bottom: 20px;
//         }

//         .hero-subtitle {
//           font-size: 20px;
//           margin-bottom: 30px;
//           opacity: 0.95;
//         }

//         .hero-button {
//           background: white;
//           color: #667eea;
//           padding: 15px 40px;
//           border: none;
//           border-radius: 50px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.3s;
//         }

//         .hero-button:hover {
//           transform: scale(1.05);
//         }

//         .main-content {
//           padding: 30px 0 60px;
//         }

//         .filter-sidebar {
//           padding-right: 20px;
//         }

//         .filter-card {
//           background: white;
//           border-radius: 12px;
//           padding: 25px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//           position: sticky;
//           top: 100px;
//         }

//         .filter-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 25px;
//           padding-bottom: 15px;
//           border-bottom: 2px solid #f3f4f6;
//         }

//         .filter-header h5 {
//           margin: 0;
//           font-weight: 700;
//         }

//         .clear-btn {
//           background: none;
//           border: none;
//           color: #ef4444;
//           font-size: 14px;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .filter-group {
//           margin-bottom: 25px;
//         }

//         .filter-label {
//           display: block;
//           font-weight: 600;
//           margin-bottom: 10px;
//           color: #1f2937;
//         }

//         .filter-select {
//           width: 100%;
//           padding: 10px 15px;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           font-size: 14px;
//           transition: border-color 0.3s;
//         }

//         .filter-select:focus {
//           outline: none;
//           border-color: #6366f1;
//         }

//         .filter-radio {
//           display: flex;
//           align-items: center;
//           padding: 8px 0;
//         }

//         .filter-radio input {
//           margin-right: 10px;
//           width: 18px;
//           height: 18px;
//           cursor: pointer;
//         }

//         .filter-radio label {
//           cursor: pointer;
//           margin: 0;
//         }

//         .price-inputs {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .price-input {
//           flex: 1;
//           padding: 10px 15px;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           font-size: 14px;
//         }

//         .price-input:focus {
//           outline: none;
//           border-color: #6366f1;
//         }

//         .products-toolbar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 30px;
//           padding: 20px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//         }

//         .toolbar-left {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .filter-toggle {
//           padding: 10px 20px;
//           background: #6366f1;
//           color: white;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .product-count {
//           margin: 0;
//           font-weight: 600;
//           color: #1f2937;
//         }

//         .sort-select {
//           padding: 10px 15px;
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           font-size: 14px;
//           cursor: pointer;
//         }

//         .products-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//           gap: 25px;
//         }

//         .no-products {
//           text-align: center;
//           padding: 80px 20px;
//         }

//         .no-products h4 {
//           font-size: 24px;
//           color: #6b7280;
//           margin-bottom: 10px;
//         }

//         .no-products p {
//           color: #9ca3af;
//           margin-bottom: 25px;
//         }

//         @media (max-width: 991px) {
//           .filter-sidebar {
//             display: none;
//           }

//           .filter-sidebar.show {
//             display: block;
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             z-index: 9999;
//             background: rgba(0,0,0,0.5);
//             padding: 20px;
//           }

//           .filter-card {
//             position: relative;
//             top: 0;
//             max-height: 90vh;
//             overflow-y: auto;
//           }

//           .hero-title {
//             font-size: 32px;
//           }

//           .hero-subtitle {
//             font-size: 16px;
//           }
//         }

//         @media (max-width: 768px) {
//           .products-grid {
//             grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
//             gap: 15px;
//           }

//           .products-toolbar {
//             flex-direction: column;
//             gap: 15px;
//             align-items: stretch;
//           }

//           .toolbar-left {
//             flex-direction: column;
//             align-items: stretch;
//           }
//         }
//       `}</style>
//     </Layout>
//   );
// };

// export default UserDashboard;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import ProductCard from './ProductCard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsArrowRight } from 'react-icons/bs';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      id: 1,
      title: "Premium Running Shoes",
      subtitle: "Experience Ultimate Comfort",
      description: "Engineered for performance with advanced cushioning technology",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Classic Sneakers",
      subtitle: "Timeless Style Meets Modern Design",
      description: "Crafted with premium materials for lasting durability",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Sports Collection",
      subtitle: "Unleash Your Athletic Potential",
      description: "High-performance footwear designed for champions",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      title: "Urban Lifestyle",
      subtitle: "Street Style Redefined",
      description: "Contemporary designs for the modern trendsetter",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
      bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    }
  ];

  useEffect(() => {
    fetchProducts();

    // Auto-slide carousel every 5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');
      
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      
      const data = await response.json();
      if (data.success) {
        // Get only active products, limit to 8 for homepage
        const activeProducts = data.products.filter(p => p.isActive).slice(0, 8);
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
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

      {/* Hero Carousel Section */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: item.bgColor }}
            >
              <div className="container-fluid px-4">
                <div className="row align-items-center">
                  <div className="col-lg-6 carousel-content">
                    <div className="content-wrapper">
                      <span className="carousel-subtitle">{item.subtitle}</span>
                      <h1 className="carousel-title">{item.title}</h1>
                      <p className="carousel-description">{item.description}</p>
                      <button 
                        className="shop-now-btn"
                        onClick={() => navigate('/user/shop')}
                      >
                        Shop Now
                        <BsArrowRight size={20} style={{ marginLeft: '8px' }} />
                      </button>
                    </div>
                  </div>
                  <div className="col-lg-6 carousel-image-wrapper">
                    <div className="image-container">
                      <img src={item.image} alt={item.title} className="carousel-image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container-fluid px-4">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Discover our handpicked selection</p>
            </div>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/user/shop')}
            >
              View All Products
              <BsArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>

          {products.length === 0 ? (
            <div className="no-products">
              <h4>No products available</h4>
              <p>Check back soon for new arrivals</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        /* Hero Carousel Styles */
        .hero-carousel {
          position: relative;
          height: 600px;
          overflow: hidden;
          background: #f9fafb;
        }

        .carousel-container {
          position: relative;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          display: flex;
          align-items: center;
        }

        .carousel-slide.active {
          opacity: 1;
          z-index: 1;
        }

        .carousel-content {
          padding: 60px 40px;
          z-index: 2;
        }

        .content-wrapper {
          max-width: 600px;
          animation: slideInLeft 0.8s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .carousel-subtitle {
          display: inline-block;
          background: rgba(255, 255, 255, 0.25);
          color: white;
          padding: 10px 24px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .carousel-title {
          font-size: 58px;
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          letter-spacing: -1px;
        }

        .carousel-description {
          font-size: 19px;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          line-height: 1.7;
          font-weight: 400;
        }

        .shop-now-btn {
          background: white;
          color: #667eea;
          padding: 18px 40px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-flex;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .shop-now-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .carousel-image-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .image-container {
          position: relative;
          width: 100%;
          max-width: 550px;
          animation: float 4s ease-in-out infinite, zoomIn 0.8s ease-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(-5deg);
          }
          50% {
            transform: translateY(-25px) rotate(5deg);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .carousel-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3));
        }

        .carousel-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 14px;
          z-index: 10;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.4s ease;
          padding: 0;
        }

        .dot:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: scale(1.2);
        }

        .dot.active {
          background: white;
          width: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
        }

        /* Featured Products Section */
        .featured-products {
          padding: 90px 0;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 44px;
          font-weight: 900;
          color: #1f2937;
          margin-bottom: 10px;
          letter-spacing: -0.5px;
        }

        .section-subtitle {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        .view-all-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 16px 32px;
          border: none;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-all-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 32px;
        }

        .no-products {
          text-align: center;
          padding: 100px 20px;
        }

        .no-products h4 {
          font-size: 26px;
          color: #6b7280;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .no-products p {
          color: #9ca3af;
          font-size: 16px;
        }

        /* Responsive Styles */
        @media (max-width: 991px) {
          .hero-carousel {
            height: 520px;
          }

          .carousel-title {
            font-size: 44px;
          }

          .carousel-description {
            font-size: 17px;
          }

          .carousel-image-wrapper {
            display: none;
          }

          .carousel-content {
            padding: 40px 20px;
          }

          .content-wrapper {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .hero-carousel {
            height: 480px;
          }

          .carousel-title {
            font-size: 36px;
          }

          .carousel-subtitle {
            font-size: 11px;
            padding: 8px 18px;
          }

          .carousel-description {
            font-size: 16px;
            margin-bottom: 30px;
          }

          .shop-now-btn {
            padding: 15px 32px;
            font-size: 14px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 34px;
          }

          .section-subtitle {
            font-size: 16px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
          }

          .carousel-dots {
            bottom: 25px;
            gap: 10px;
          }

          .dot {
            width: 10px;
            height: 10px;
          }

          .dot.active {
            width: 32px;
          }

          .featured-products {
            padding: 60px 0;
          }
        }

        @media (max-width: 480px) {
          .carousel-title {
            font-size: 28px;
          }

          .carousel-subtitle {
            font-size: 10px;
            padding: 6px 14px;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default UserDashboard;