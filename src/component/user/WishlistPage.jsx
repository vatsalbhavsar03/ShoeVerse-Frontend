import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsTrash, BsCart3, BsHeart, BsArrowLeft } from 'react-icons/bs';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userId = JSON.parse(localStorage.getItem('user'))?.userId || 1;
  const API_BASE_URL = 'https://localhost:7208/api';

  useEffect(() => {
    fetchWishlist();
    
    // Listen for wishlist updates
    window.addEventListener('wishlistUpdated', fetchWishlist);
    return () => window.removeEventListener('wishlistUpdated', fetchWishlist);
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      } else {
        toast.error('Failed to load wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('An error occurred while loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${productId}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.productId !== productId));
        toast.success('Removed from wishlist');
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('An error occurred');
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: item.productId,
        name: item.productName,
        price: item.price,
        image: `${API_BASE_URL.replace('/api', '')}${item.mainImageUrl}`,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const addAllToCart = () => {
    wishlist.forEach(item => addToCart(item));
    toast.success(`Added ${wishlist.length} items to cart!`);
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      for (const item of wishlist) {
        await removeFromWishlist(item.productId);
      }
      setWishlist([]);
      toast.info('Wishlist cleared');
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loading-spinner">Loading your wishlist...</div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        {/* Back Button for Empty State */}
        <button className="back-button-top" onClick={() => navigate(-1)}>
          <BsArrowLeft size={20} />
          Back
        </button>

        <div className="empty-wishlist">
          <BsHeart size={80} color="#d1d5db" />
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favorite shoes and come back to them later!</p>
          <button className="browse-btn" onClick={() => navigate('/user/userDashboard')}>
            Browse Products
          </button>
        </div>

        <style>{`
          .wishlist-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
          }

          .back-button-top {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 1px solid #e5e7eb;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: 20px;
          }

          .back-button-top:hover {
            background: #f9fafb;
            border-color: #6366f1;
            color: #6366f1;
          }

          .empty-wishlist {
            text-align: center;
            padding: 80px 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }

          .empty-wishlist h2 {
            font-size: 28px;
            color: #1f2937;
            margin: 20px 0 10px;
          }

          .empty-wishlist p {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
          }

          .browse-btn {
            background: #6366f1;
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .browse-btn:hover {
            background: #4f46e5;
            transform: translateY(-2px);
          }

          .loading-spinner {
            text-align: center;
            padding: 60px 20px;
            font-size: 18px;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            <BsArrowLeft size={20} />
          </button>
          <div>
            <h1>My Wishlist</h1>
            <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="clear-btn" onClick={clearWishlist}>
            <BsTrash size={18} />
            Clear All
          </button>
        </div>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(item => (
          <div key={item.wishlistId} className="wishlist-item">
            <div 
              className="item-image-container"
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <img
                src={`${API_BASE_URL.replace('/api', '')}${item.mainImageUrl}`}
                alt={item.productName}
                className="item-image"
              />
            </div>

            <div className="item-details">
              <div className="item-badges">
                {item.categoryName && (
                  <span className="category-badge">{item.categoryName}</span>
                )}
                {item.brandName && (
                  <span className="brand-badge">{item.brandName}</span>
                )}
              </div>

              <h3 
                className="item-name"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                {item.productName}
              </h3>

              <div className="item-price">₹{item.price.toFixed(2)}</div>

              <div className="item-actions">
                <button 
                  className="add-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  <BsCart3 size={16} />
                  Add to Cart
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.productId)}
                >
                  <BsTrash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .wishlist-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          color: #374151;
        }

        .back-button:hover {
          background: #f9fafb;
          border-color: #6366f1;
          color: #6366f1;
          transform: translateX(-2px);
        }

        .back-button-top {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 20px;
        }

        .back-button-top:hover {
          background: #f9fafb;
          border-color: #6366f1;
          color: #6366f1;
        }

        .wishlist-header h1 {
          font-size: 32px;
          color: #1f2937;
          margin: 0;
        }

        .wishlist-header p {
          color: #6b7280;
          margin: 5px 0 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .add-all-btn,
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .add-all-btn {
          background: #6366f1;
          color: white;
        }

        .add-all-btn:hover {
          background: #4f46e5;
          transform: translateY(-2px);
        }

        .clear-btn {
          background: #ef4444;
          color: white;
        }

        .clear-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .wishlist-item {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }

        .wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.12);
        }

        .item-image-container {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #f9fafb;
          cursor: pointer;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .wishlist-item:hover .item-image {
          transform: scale(1.05);
        }

        .item-details {
          padding: 20px;
        }

        .item-badges {
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

        .item-name {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px;
          cursor: pointer;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-name:hover {
          color: #6366f1;
        }

        .item-price {
          font-size: 22px;
          font-weight: 700;
          color: #6366f1;
          margin-bottom: 16px;
        }

        .item-actions {
          display: flex;
          gap: 10px;
        }

        .add-cart-btn,
        .remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .add-cart-btn {
          flex: 1;
          background: #6366f1;
          color: white;
        }

        .add-cart-btn:hover {
          background: #4f46e5;
        }

        .remove-btn {
          width: 44px;
          background: #fee2e2;
          color: #ef4444;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .wishlist-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .header-left {
            width: 100%;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .add-all-btn,
          .clear-btn {
            width: 100%;
            justify-content: center;
          }

          .wishlist-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }

          .item-details {
            padding: 15px;
          }

          .item-name {
            font-size: 14px;
          }

          .item-price {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;
