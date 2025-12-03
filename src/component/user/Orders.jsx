import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { BsArrowLeft, BsBoxSeam, BsClock, BsCheckCircle, BsXCircle, BsTruck } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.userId) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }

    setUser(userData);
    fetchOrders(userData.userId);
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7208/api/Order/GetUserOrder/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders Response:', data);

      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`https://localhost:7208/api/Order/CancelOrder/${orderId}`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Order cancelled successfully');
        // Refresh orders
        fetchOrders(user.userId);
      } else {
        toast.error(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <BsClock className="status-icon pending" />;
      case 'processing':
        return <BsTruck className="status-icon processing" />;
      case 'paid':
        return <BsCheckCircle className="status-icon paid" />;
      case 'delivered':
        return <BsCheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <BsXCircle className="status-icon cancelled" />;
      default:
        return <BsBoxSeam className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-badge pending';
      case 'processing':
        return 'status-badge processing';
      case 'paid':
        return 'status-badge paid';
      case 'delivered':
        return 'status-badge delivered';
      case 'cancelled':
        return 'status-badge cancelled';
      case 'payment initiated':
        return 'status-badge payment-initiated';
      default:
        return 'status-badge';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (item) => {
    if (item.color?.imageUrl) {
      return `https://localhost:7208${item.color.imageUrl}`;
    }
    if (item.product?.productColors?.[0]?.productImages?.[0]?.imageUrl) {
      return `https://localhost:7208${item.product.productColors[0].productImages[0].imageUrl}`;
    }
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const getPaymentMethod = (order) => {
    if (order.payments && order.payments.length > 0) {
      return order.payments[0].paymentMethod;
    }
    return 'N/A';
  };

  const getPaymentStatus = (order) => {
    if (order.payments && order.payments.length > 0) {
      return order.payments[0].paymentStatus;
    }
    return 'N/A';
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

      <div className="orders-container">
        <div className="container py-5">
          {/* Header */}
          <div className="orders-header">
            <button className="back-btn" onClick={() => navigate('/user/userDashboard')}>
              <BsArrowLeft size={20} />
            </button>
            <h2>My Orders</h2>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/no-order-illustration-download-in-svg-png-gif-file-formats--empty-state-cart-ecommerce-shopping-pack-e-commerce-illustrations-4371921.png"
                alt="No Orders"
                className="empty-orders-image"
              />
              <h3>No orders yet</h3>
              <p>Start shopping and your orders will appear here!</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/user/userDashboard')}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.orderId} className="order-card">
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-info">
                      <h5>Order #{order.orderId}</h5>
                      <p className="order-date">{formatDate(order.orderDate)}</p>
                    </div>

                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span className={getStatusClass(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="summary-item">
                      <span className="label">Total Amount:</span>
                      <span className="value amount">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Items:</span>
                      <span className="value">{order.orderItems?.length || 0}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Payment Method:</span>
                      <span className="value">{getPaymentMethod(order)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Payment Status:</span>
                      <span className={`value ${getPaymentStatus(order).toLowerCase()}`}>
                        {getPaymentStatus(order)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="order-items-preview">
                      {order.orderItems.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={getImageUrl(item)}
                          alt={item.product?.name || 'Product'}
                          className="item-preview-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                          }}
                        />
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="more-items">+{order.orderItems.length - 3}</div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="order-actions">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => toggleOrderDetails(order.orderId)}
                    >
                      {expandedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                    </button>

                    {(order.status.toLowerCase() === 'pending' || 
                      order.status.toLowerCase() === 'payment initiated') && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => cancelOrder(order.orderId)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.orderId && (
                    <div className="order-details">
                      <hr />
                      
                      {/* Delivery Address */}
                      <div className="detail-section">
                        <h6>Delivery Address</h6>
                        <p>{order.address}</p>
                        <p className="text-muted">Phone: {order.phone}</p>
                      </div>

                      {/* Order Items */}
                      <div className="detail-section">
                        <h6>Order Items</h6>
                        <div className="detailed-items">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="detailed-item">
                              <img
                                src={getImageUrl(item)}
                                alt={item.product?.name || 'Product'}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                              />
                              <div className="item-info">
                                <h6>{item.product?.name || 'Product Name'}</h6>
                                <p className="text-muted">
                                  {item.color?.colorName && <span>Color: {item.color.colorName}</span>}
                                  {item.size?.sizeName && <span> • Size: {item.size.sizeName}</span>}
                                </p>
                                <p className="text-muted">Quantity: {item.quantity}</p>
                              </div>
                              <div className="item-price">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details */}
                      {order.payments && order.payments.length > 0 && (
                        <div className="detail-section">
                          <h6>Payment Details</h6>
                          <div className="payment-details">
                            <p><strong>Method:</strong> {order.payments[0].paymentMethod}</p>
                            <p><strong>Status:</strong> {order.payments[0].paymentStatus}</p>
                            <p><strong>Transaction ID:</strong> {order.payments[0].transactionId}</p>
                            <p><strong>Amount:</strong> ₹{order.payments[0].amount.toFixed(2)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .orders-container {
          background: #f9fafb;
          min-height: calc(100vh - 200px);
        }

        .orders-header {
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

        .orders-header h2 {
          margin: 0;
          font-weight: 700;
          color: #1f2937;
        }

        .empty-orders {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .empty-orders-image {
          width: 300px;
          max-width: 100%;
          margin-bottom: 30px;
        }

        .empty-orders h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .empty-orders p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .order-info h5 {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .order-date {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-icon {
          font-size: 24px;
        }

        .status-icon.pending {
          color: #f59e0b;
        }

        .status-icon.processing {
          color: #3b82f6;
        }

        .status-icon.paid,
        .status-icon.delivered {
          color: #10b981;
        }

        .status-icon.cancelled {
          color: #ef4444;
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .status-badge.processing {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-badge.paid,
        .status-badge.delivered {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .status-badge.payment-initiated {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .order-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .summary-item .label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .summary-item .value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
        }

        .summary-item .value.amount {
          color: #6366f1;
          font-size: 20px;
        }

        .summary-item .value.paid {
          color: #10b981;
        }

        .summary-item .value.pending {
          color: #f59e0b;
        }

        .order-items-preview {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          align-items: center;
        }

        .item-preview-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #f3f4f6;
        }

        .more-items {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b7280;
        }

        .order-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s;
          font-size: 14px;
          border: 2px solid;
        }

        .btn-outline-primary {
          border-color: #6366f1;
          color: #6366f1;
          background: white;
        }

        .btn-outline-primary:hover {
          background: #6366f1;
          color: white;
        }

        .btn-outline-danger {
          border-color: #ef4444;
          color: #ef4444;
          background: white;
        }

        .btn-outline-danger:hover {
          background: #ef4444;
          color: white;
        }

        .btn-primary {
          background: #6366f1;
          border-color: #6366f1;
          color: white;
        }

        .btn-primary:hover {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .order-details {
          margin-top: 20px;
        }

        .detail-section {
          margin-bottom: 25px;
        }

        .detail-section h6 {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .detail-section p {
          margin-bottom: 8px;
          color: #374151;
          line-height: 1.6;
        }

        .detailed-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .detailed-item {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 12px;
          align-items: center;
        }

        .detailed-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e5e7eb;
        }

        .detailed-item .item-info {
          flex: 1;
        }

        .detailed-item .item-info h6 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 5px;
        }

        .detailed-item .item-info p {
          font-size: 14px;
          margin-bottom: 3px;
        }

        .detailed-item .item-price {
          font-size: 18px;
          font-weight: 700;
          color: #6366f1;
        }

        .payment-details p {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .payment-details strong {
          min-width: 130px;
          color: #6b7280;
        }

        hr {
          margin: 25px 0;
          border-color: #e5e7eb;
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .order-summary {
            grid-template-columns: 1fr;
          }

          .detailed-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .detailed-item img {
            width: 100%;
            height: 200px;
          }

          .order-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Orders;
