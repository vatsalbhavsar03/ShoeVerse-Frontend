import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { BsTrash, BsPlus, BsDash, BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userId) {
      setUserId(user.userId);
      fetchCart(user.userId);
    } else {
      setLoading(false);
      toast.info('Please login to view your cart');
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7208/api/Cart/user/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart Response:', data);

      // Handle the new API response structure
      if (data.success && data.data) {
        setCartItems(data.data.items || []);
      } else if (data.cartItems) {
        // Fallback for old API structure
        setCartItems(data.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart. Please try again.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`https://localhost:7208/api/Cart/item/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCartItems(prev =>
          prev.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        toast.success('Quantity updated');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error(result.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`https://localhost:7208/api/Cart/item/${cartItemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
        toast.success('Item removed from cart');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error(result.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const proceedToCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.info('Your cart is empty');
      return;
    }
    navigate('/checkout'); // -> goes to Checkout.jsx route
  };


  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;

    if (!userId) {
      toast.error('User not found');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7208/api/Cart/user/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCartItems([]);
        toast.success('Cart cleared');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        toast.error(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart. Please try again.');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.unitPrice || item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // TAX REMOVED: always return 0 to preserve UI while not applying taxes
  const calculateTax = () => {
    return 0;
  };

  // TOTAL equals subtotal since tax is removed
  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const getImageUrl = (item) => {
    // Handle new API response structure
    if (item.colorImageUrl) {
      return `https://localhost:7208${item.colorImageUrl}`;
    }
    // Try to get image from color object
    if (item.color?.imageUrl) {
      return `https://localhost:7208${item.color.imageUrl}`;
    }
    // Fallback to product colors
    if (item.product?.productColors?.[0]?.productImages?.[0]?.imageUrl) {
      return `https://localhost:7208${item.product.productColors[0].productImages[0].imageUrl}`;
    }
    return 'https://via.placeholder.com/120x120?text=No+Image';
  };

  const getProductName = (item) => {
    return item.productName || item.product?.name || 'Product Name';
  };

  const getColorName = (item) => {
    return item.colorName || item.color?.colorName || item.color?.name || '';
  };

  // Replace existing getSizeName with this (no UI changes)
  const getSizeName = (item) => {
    // Prefer the API-provided selected size (camelCase or PascalCase)
    if (item.sizeName) return item.sizeName;
    if (item.SizeName) return item.SizeName;

    // Then prefer the nested size object if API sent one
    if (item.size && (item.size.sizeName || item.size.SizeName || item.size.sizeValue))
      return item.size.sizeName ?? item.size.SizeName ?? item.size.sizeValue;

    // Otherwise, no selected size -> show nothing
    return '';
  };

  const getPrice = (item) => {
    return item.unitPrice || item.product?.price || 0;
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="cart-container">
        <div className="container py-5">
          {/* Header */}
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate('/user/userDashboard')}>
              <BsArrowLeft size={20} />
            </button>
            <h2>Shopping Cart ({cartItems.length})</h2>
            {cartItems.length > 0 && (
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png"
                alt="Empty Cart"
                className="empty-cart-image"
              />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/user/userDashboard')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="row">
              {/* Cart Items */}
              <div className="col-lg-8">
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.cartItemId} className="cart-item">
                      {/* Product Image - Clickable */}
                      <div
                        className="cart-item-image-wrapper"
                        onClick={() => handleProductClick(item.productId)}
                      >
                        <img
                          src={getImageUrl(item)}
                          alt={getProductName(item)}
                          className="cart-item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="cart-item-details">
                        <h5
                          className="product-name-link"
                          onClick={() => handleProductClick(item.productId)}
                        >
                          {getProductName(item)}
                        </h5>
                        <p className="text-muted">
                          {item.product?.description?.substring(0, 60) || 'Premium quality footwear'}...
                        </p>

                        {/* Color and Size */}
                        <div className="item-specs">
                          {getColorName(item) && (
                            <span className="spec-badge">
                              {item.color?.hexCode && (
                                <div
                                  className="color-dot"
                                  style={{
                                    backgroundColor: item.color.hexCode
                                  }}
                                />
                              )}
                              <strong>{getColorName(item)}</strong>
                            </span>
                          )}
                          {getSizeName(item) && (
                            <span className="spec-badge">
                              Size: <strong>{getSizeName(item)}</strong>
                            </span>
                          )}
                        </div>

                        {/* Price per unit */}
                        <p className="unit-price">
                          ₹{getPrice(item).toFixed(2)} each
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <BsDash />
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          >
                            <BsPlus />
                          </button>
                        </div>

                        <div className="item-price">
                          ₹{(getPrice(item) * item.quantity).toFixed(2)}
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.cartItemId)}
                          title="Remove from cart"
                        >
                          <BsTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary">
                  <h4>Order Summary</h4>

                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="text-success fw-bold">Free</span>
                  </div>

                  <div className="summary-row">
                    <span>Tax (18% GST)</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100 mt-3"
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>


                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => navigate('/user/userDashboard')}
                  >
                    Continue Shopping
                  </button>

                  {/* Secure Checkout Badge */}
                  <div className="secure-badge">
                    <small className="text-muted">
                      🔒 Secure Checkout
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cart-container {
          background: #f9fafb;
          min-height: calc(100vh - 200px);
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-btn {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          color: #6b7280;
        }

        .back-btn:hover {
          background: #f3f4f6;
          transform: translateX(-3px);
          color: #6366f1;
        }

        .cart-header h2 {
          flex: 1;
          margin: 0;
          font-weight: 700;
          color: #1f2937;
        }

        .clear-cart-btn {
          background: none;
          border: 2px solid #ef4444;
          color: #ef4444;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .clear-cart-btn:hover {
          background: #ef4444;
          color: white;
        }

        .empty-cart {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .empty-cart-image {
          width: 300px;
          max-width: 100%;
          margin-bottom: 30px;
        }

        .empty-cart h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .empty-cart p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .cart-items {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .cart-item {
          display: flex;
          gap: 20px;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          transition: background 0.3s;
        }

        .cart-item:hover {
          background: #f9fafb;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item-image-wrapper {
          cursor: pointer;
          transition: transform 0.3s;
        }

        .cart-item-image-wrapper:hover {
          transform: scale(1.05);
        }

        .cart-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px solid #f3f4f6;
          flex-shrink: 0;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .product-name-link {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
          cursor: pointer;
          transition: color 0.3s;
        }

        .product-name-link:hover {
          color: #6366f1;
        }

        .unit-price {
          margin-top: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .item-specs {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .spec-badge {
          padding: 6px 12px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 13px;
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid #e5e7eb;
        }

        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 15px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f3f4f6;
          border-radius: 8px;
          padding: 5px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          background: white;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          color: #6b7280;
        }

        .qty-btn:hover:not(:disabled) {
          background: #6366f1;
          color: white;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          color: #1f2937;
        }

        .item-price {
          font-size: 20px;
          font-weight: 700;
          color: #6366f1;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .remove-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .order-summary {
          background: white;
          border-radius: 16px;
          padding: 30px;
          position: sticky;
          top: 120px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .order-summary h4 {
          font-weight: 700;
          margin-bottom: 20px;
          color: #1f2937;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 15px;
          color: #6b7280;
        }

        .summary-row.total {
          font-size: 22px;
          font-weight: 700;
          color: #1f2937;
        }

        hr {
          margin: 20px 0;
          border-color: #e5e7eb;
        }

        .btn {
          padding: 14px 24px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s;
          font-size: 16px;
        }

        .btn-primary {
          background: #6366f1;
          border: none;
        }

        .btn-primary:hover {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .btn-outline-secondary {
          border: 2px solid #e5e7eb;
          color: #6b7280;
          background: white;
        }

        .btn-outline-secondary:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .secure-badge {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
          }

          .cart-item-image {
            width: 100%;
            height: 200px;
          }

          .cart-item-actions {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            align-items: center;
          }

          .order-summary {
            position: static;
            margin-top: 30px;
          }

          .cart-header {
            flex-wrap: wrap;
          }

          .cart-header h2 {
            font-size: 22px;
          }

          .clear-cart-btn {
            width: 100%;
            margin-top: 10px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Cart;
