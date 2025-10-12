import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { BsHeart, BsHeartFill, BsEye, BsCart3 } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  const navigate = useNavigate(); // Add this hook
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // ... rest of your existing code (fetchProducts, toggleWishlist, getMainImage, etc.)

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');
      const data = await response.json();
      
      if (data.success) {
        const activeProducts = data.products.filter(p => p.isActive);
        setProducts(activeProducts);
      }
    } catch (error) {
      toast.error('Failed to load products', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.info('Removed from wishlist', { position: "top-right", autoClose: 2000 });
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist', { position: "top-right", autoClose: 2000 });
    }
  };

  const getMainImage = (product) => {
    const mainImage = product.productColors?.[0]?.productImages?.find(img => img.isMainImage) || 
                     product.productColors?.[0]?.productImages?.[0];
    return mainImage ? `https://localhost:7208${mainImage.imageUrl}` : '/placeholder-image.jpg';
  };

  // Add this function to handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      {/* Hero Section */}
      <div className="bg-light py-5 mb-4">
        <div className="container">
          <h1 className="display-4 fw-bold mb-2">Welcome to ShoeVerse</h1>
          <p className="lead text-muted">Explore our premium footwear collection</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mb-5">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Our Products</h2>
            <p className="text-muted">Browse our latest collection of {products.length} products</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No products available</h4>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(product => (
              <div key={product.productId} className="col-md-6 col-lg-3">
                <div className="card h-100 shadow-sm border-0 product-card">
                  {/* Make image clickable */}
                  <div 
                    className="position-relative overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product.productId)}
                  >
                    <img
                      src={getMainImage(product)}
                      className="card-img-top product-image"
                      alt={product.name}
                      style={{ height: '280px', objectFit: 'cover' }}
                    />
                    <button
                      className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                      style={{ width: '40px', height: '40px', zIndex: 10 }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        toggleWishlist(product.productId);
                      }}
                    >
                      {wishlist.includes(product.productId) ? (
                        <BsHeartFill className="text-danger" />
                      ) : (
                        <BsHeart />
                      )}
                    </button>
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-0 m-3">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <span className="badge bg-light text-dark me-2">
                        {product.category?.categoryName}
                      </span>
                      <span className="badge bg-secondary">
                        {product.brand?.brandName}
                      </span>
                    </div>
                    {/* Make title clickable */}
                    <h5 
                      className="card-title fw-bold mb-2 cursor-pointer"
                      onClick={() => handleProductClick(product.productId)}
                    >
                      {product.name}
                    </h5>
                    <p className="card-text text-muted small" style={{ minHeight: '40px' }}>
                      {product.description.substring(0, 80)}...
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-auto">
                        <span className="h4 fw-bold text-primary mb-0">${product.price}</span>
                      </div>
                      <div className="text-muted small">
                        {product.gender}
                      </div>
                    </div>
                    {product.productColors && product.productColors.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted me-2">Colors:</small>
                        {product.productColors.slice(0, 5).map((color, idx) => (
                          <span
                            key={idx}
                            className="d-inline-block rounded-circle me-1"
                            style={{
                              width: '20px',
                              height: '20px',
                              backgroundColor: color.hexCode,
                              border: '2px solid #ddd'
                            }}
                            title={color.colorName}
                          ></span>
                        ))}
                        {product.productColors.length > 5 && (
                          <small className="text-muted">+{product.productColors.length - 5}</small>
                        )}
                      </div>
                    )}
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <BsCart3 className="me-2" />
                        Add to Cart
                      </button>
                      {/* Update Quick View button */}
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleProductClick(product.productId)}
                      >
                        <BsEye className="me-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .product-image {
          transition: transform 0.3s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default UserDashboard;
