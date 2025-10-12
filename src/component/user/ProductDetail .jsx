import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsHeart, BsHeartFill, BsCart3, BsShare, BsStar, BsStarFill, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7208/api/Product/GetProductById/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.product);
        // Set default color to first available
        if (data.product.productColors && data.product.productColors.length > 0) {
          setSelectedColor(data.product.productColors[0]);
        }
      } else {
        toast.error('Product not found', { position: "top-right", autoClose: 3000 });
        navigate('/products');
      }
    } catch (error) {
      toast.error('Failed to load product details', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');
      const data = await response.json();
      
      if (data.success) {
        // Get products from same category, excluding current product
        const related = data.products
          .filter(p => p.isActive && p.categoryId === product.categoryId && p.productId !== product.productId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setCurrentImageIndex(0);
  };

  const getCurrentImages = () => {
    if (!selectedColor || !selectedColor.productImages) return [];
    return selectedColor.productImages;
  };

  const nextImage = () => {
    const images = getCurrentImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = getCurrentImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning('Please select a size', { position: "top-right", autoClose: 2000 });
      return;
    }
    
    // Add to cart logic here
    toast.success(`Added ${quantity} item(s) to cart!`, { position: "top-right", autoClose: 2000 });
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    if (!isWishlist) {
      toast.success('Added to wishlist', { position: "top-right", autoClose: 2000 });
    } else {
      toast.info('Removed from wishlist', { position: "top-right", autoClose: 2000 });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { position: "top-right", autoClose: 2000 });
    }
  };

  const getMainImage = (prod) => {
    const mainImage = prod.productColors?.[0]?.productImages?.find(img => img.isMainImage) || 
                     prod.productColors?.[0]?.productImages?.[0];
    return mainImage ? `https://localhost:7208${mainImage.imageUrl}` : '/placeholder-image.jpg';
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

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h3>Product not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const currentImages = getCurrentImages();
  const currentPrice = selectedColor?.price || product.price;
  const availableStock = selectedColor?.stock || product.stock;

  return (
    <>
      <ToastContainer />
      
      {/* Breadcrumb */}
      <div className="bg-light py-3 mb-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/products" className="text-decoration-none">Products</a>
              </li>
              <li className="breadcrumb-item">
                <span className="text-decoration-none">{product.category?.categoryName}</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mb-5">
        <div className="row g-4">
          {/* Image Gallery */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body p-0">
                <div className="position-relative" style={{ height: '500px' }}>
                  {currentImages.length > 0 ? (
                    <>
                      <img
                        src={`https://localhost:7208${currentImages[currentImageIndex].imageUrl}`}
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      {currentImages.length > 1 && (
                        <>
                          <button
                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                            onClick={prevImage}
                          >
                            <BsChevronLeft />
                          </button>
                          <button
                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                            onClick={nextImage}
                          >
                            <BsChevronRight />
                          </button>
                        </>
                      )}
                      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                        <span className="badge bg-dark bg-opacity-75 px-3 py-2">
                          {currentImageIndex + 1} / {currentImages.length}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <p className="text-muted">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="d-flex gap-2 overflow-auto">
                {currentImages.map((img, index) => (
                  <div
                    key={index}
                    className={`border rounded ${currentImageIndex === index ? 'border-primary border-3' : ''}`}
                    style={{ minWidth: '100px', height: '100px', cursor: 'pointer' }}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={`https://localhost:7208${img.imageUrl}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-100 h-100 rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="mb-3">
              <span className="badge bg-light text-dark me-2 mb-2">{product.category?.categoryName}</span>
              <span className="badge bg-secondary mb-2">{product.brand?.brandName}</span>
            </div>

            <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="mb-3 d-flex align-items-center">
              <div className="text-warning me-2">
                <BsStarFill />
                <BsStarFill />
                <BsStarFill />
                <BsStarFill />
                <BsStar />
              </div>
              <span className="text-muted">(4.0) 125 Reviews</span>
            </div>

            {/* Price - FIXED */}
            <div className="mb-4">
              <h2 className="text-primary fw-bold mb-2">${currentPrice.toFixed(2)}</h2>
              {availableStock > 0 ? (
                <span className="badge bg-success">In Stock ({availableStock} available)</span>
              ) : (
                <span className="badge bg-danger">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h5 className="fw-bold mb-2">Description</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="mb-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">Gender</small>
                    <strong>{product.gender}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">Material</small>
                    <strong>{product.material}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {product.productColors && product.productColors.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  Select Color: <span className="text-primary">{selectedColor?.colorName}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {product.productColors.map((color) => (
                    <button
                      key={color.colorId}
                      className={`btn border rounded-circle position-relative ${selectedColor?.colorId === color.colorId ? 'border-primary border-3' : ''}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: color.hexCode,
                        padding: 0
                      }}
                      onClick={() => handleColorChange(color)}
                      title={color.colorName}
                    >
                      {selectedColor?.colorId === color.colorId && (
                        <span className="position-absolute top-50 start-50 translate-middle text-white" style={{ textShadow: '0 0 3px #000' }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Select Size</h6>
              <div className="d-flex flex-wrap gap-2">
                {['6', '7', '8', '9', '10', '11', '12'].map((size) => (
                  <button
                    key={size}
                    className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-outline-primary'}`}
                    style={{ minWidth: '60px' }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Quantity</h6>
              <div className="input-group" style={{ maxWidth: '150px' }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 mb-3">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={availableStock === 0}
              >
                <BsCart3 className="me-2" />
                Add to Cart
              </button>
              <div className="row g-2">
                <div className="col-6">
                  <button className="btn btn-outline-danger w-100" onClick={toggleWishlist}>
                    {isWishlist ? <BsHeartFill className="me-2" /> : <BsHeart className="me-2" />}
                    Wishlist
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-secondary w-100" onClick={handleShare}>
                    <BsShare className="me-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card bg-light border-0">
              <div className="card-body">
                <div className="d-flex align-items-start mb-2">
                  <span className="me-2">✓</span>
                  <small>Free shipping on orders over $50</small>
                </div>
                <div className="d-flex align-items-start mb-2">
                  <span className="me-2">✓</span>
                  <small>30-day return policy</small>
                </div>
                <div className="d-flex align-items-start">
                  <span className="me-2">✓</span>
                  <small>Secure checkout with SSL encryption</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">Product Specifications</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Brand</td>
                          <td className="fw-semibold">{product.brand?.brandName}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Category</td>
                          <td className="fw-semibold">{product.category?.categoryName}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Gender</td>
                          <td className="fw-semibold">{product.gender}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Material</td>
                          <td className="fw-semibold">{product.material}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Available Colors</td>
                          <td className="fw-semibold">{product.productColors?.length || 0}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Stock Status</td>
                          <td className="fw-semibold">
                            {availableStock > 0 ? `${availableStock} In Stock` : 'Out of Stock'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 mb-4">
              <h3 className="fw-bold">You May Also Like</h3>
            </div>
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.productId} className="col-md-6 col-lg-3 mb-4">
                <div 
                  className="card h-100 shadow-sm border-0 product-card"
                  onClick={() => navigate(`/product/${relatedProduct.productId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={getMainImage(relatedProduct)}
                    className="card-img-top"
                    alt={relatedProduct.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="card-title fw-bold">{relatedProduct.name}</h6>
                    <p className="text-primary fw-bold mb-0">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-card {
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
};

export default ProductDetail;
