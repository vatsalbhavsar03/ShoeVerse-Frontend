import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsHeart, BsHeartFill, BsEye, BsCart3 } from 'react-icons/bs';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlist, setIsWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get userId from localStorage (replace with your auth system)
  const userId = JSON.parse(localStorage.getItem('user'))?.userId || 1;
  const API_BASE_URL = 'https://localhost:7208/api';

  useEffect(() => {
    checkWishlist();
  }, [product.productId]);

  const checkWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/user/${userId}`);
      if (response.ok) {
        const wishlistData = await response.json();
        const isInWishlist = wishlistData.some(item => item.productId === product.productId);
        setIsWishlist(isInWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const getMainImage = () => {
    const mainImage = product.productColors?.[0]?.productImages?.find(img => img.isMainImage) || 
                     product.productColors?.[0]?.productImages?.[0];
    return mainImage ? `${API_BASE_URL.replace('/api', '')}${mainImage.imageUrl}` : '/placeholder-image.jpg';
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (isWishlist) {
        // Remove from wishlist
        const response = await fetch(
          `${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${product.productId}`,
          { method: 'DELETE' }
        );
        
        if (response.ok) {
          setIsWishlist(false);
          toast.info('Removed from wishlist');
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            productId: product.productId
          })
        });
        
        if (response.ok) {
          setIsWishlist(true);
          toast.success('Added to wishlist');
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === product.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        image: getMainImage(),
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div 
      className="product-card-wrapper"
      onClick={() => navigate(`/product/${product.productId}`)}
    >
      <div className="product-image-container">
        <img
          src={getMainImage()}
          alt={product.name}
          className="product-image"
        />
        
        <button 
          className="wishlist-btn" 
          onClick={toggleWishlist}
          disabled={loading}
        >
          {isWishlist ? <BsHeartFill size={20} /> : <BsHeart size={20} />}
        </button>
        
        {product.stock === 0 && (
          <span className="stock-badge out-of-stock">Out of Stock</span>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <span className="stock-badge low-stock">Low Stock</span>
        )}
      </div>

      <div className="product-info">
        <div className="product-badges">
          <span className="category-badge">{product.category?.categoryName}</span>
          <span className="brand-badge">{product.brand?.brandName}</span>
        </div>

        <h6 className="product-name">{product.name}</h6>
        
        <p className="product-description">
          {product.description?.substring(0, 50)}...
        </p>

        <div className="product-footer">
          <div>
            <span className="product-price">₹{product.price.toFixed(2)}</span>
            <span className="product-gender">{product.gender}</span>
          </div>
        </div>

        {product.productColors && product.productColors.length > 0 && (
          <div className="color-swatches">
            {product.productColors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="color-swatch"
                style={{ backgroundColor: color.hexCode }}
                title={color.colorName}
              />
            ))}
            {product.productColors.length > 4 && (
              <span className="color-more">+{product.productColors.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .product-card-wrapper {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .product-card-wrapper:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
        }

        .product-image-container {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1;
          background: #f9fafb;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card-wrapper:hover .product-image {
          transform: scale(1.08);
        }

        .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .wishlist-btn:hover {
          transform: scale(1.1);
        }

        .wishlist-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wishlist-btn svg {
          color: #ef4444;
        }

        .stock-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          z-index: 2;
        }

        .out-of-stock {
          background: #ef4444;
          color: white;
        }

        .low-stock {
          background: #f59e0b;
          color: white;
        }

        .product-info {
          padding: 20px;
        }

        .product-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .category-badge,
        .brand-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .category-badge {
          background: #f3f4f6;
          color: #374151;
        }

        .brand-badge {
          background: #6366f1;
          color: white;
        }

        .product-name {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          line-height: 1.4;
          min-height: 44px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-description {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 15px;
          min-height: 38px;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .product-price {
          font-size: 22px;
          font-weight: 700;
          color: #6366f1;
          display: block;
        }

        .product-gender {
          font-size: 12px;
          color: #9ca3af;
          display: block;
          margin-top: 4px;
        }

        .color-swatches {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .color-swatch {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .color-swatch:hover {
          transform: scale(1.15);
          border-color: #6366f1;
        }

        .color-more {
          font-size: 11px;
          color: #6b7280;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .product-info {
            padding: 15px;
          }

          .product-name {
            font-size: 14px;
            min-height: 38px;
          }

          .product-price {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
