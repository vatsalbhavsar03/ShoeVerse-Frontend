import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [dateFilter, setDateFilter] = useState('all');

  const statusOptions = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const filterOptions = ['All', ...statusOptions];

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7208/api/Order/GetAllOrders');
      
      if (response.data.success) {
        setOrders(response.data.orders);
        toast.success(`Loaded ${response.data.orders.length} orders successfully!`, {
          position: "top-right",
          autoClose: 2000
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.', {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter (by order ID, customer name, email, phone)
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderId.toString().includes(searchTerm) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.includes(searchTerm)
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(order => new Date(order.orderDate) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(order => new Date(order.orderDate) >= monthAgo);
    }

    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Show loading toast
    const loadingToast = toast.loading('Updating order status...', {
      position: "top-right"
    });

    try {
      const response = await axios.patch('https://localhost:7208/api/Order/UpdateOrderStatus', {
        orderId: orderId,
        status: newStatus
      });

      if (response.data.success) {
        // Update local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } 
              : order
          )
        );

        // Update toast to success
        toast.update(loadingToast, {
          render: `Order #${orderId} status updated to ${newStatus}!`,
          type: "success",
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.update(loadingToast, {
        render: 'Failed to update order status',
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Pending': 'bg-warning text-dark',
      'Processing': 'bg-info text-white',
      'Paid': 'bg-success',
      'Shipped': 'bg-primary',
      'Delivered': 'bg-success',
      'Cancelled': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const getPaymentMethodBadge = (order) => {
    if (order.payments && order.payments.length > 0) {
      const payment = order.payments[0];
      return (
        <div>
          <span className="badge bg-info me-1">{payment.paymentMethod}</span>
          <span className={`badge ${payment.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
            {payment.paymentStatus}
          </span>
        </div>
      );
    }
    return <span className="badge bg-secondary">COD</span>;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Pending'); // Reset to 'Pending' instead of 'All'
    setDateFilter('all');
    toast.info('Filters cleared, showing pending orders', {
      position: "top-right",
      autoClose: 2000
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-bag-check-fill me-2 text-primary"></i>
            Orders Management
          </h2>
          <p className="text-muted">Manage and track all customer orders</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={fetchAllOrders}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Orders</p>
                  <h3 className="fw-bold mb-0">{orders.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-cart-check-fill text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Pending</p>
                  <h3 className="fw-bold mb-0 text-warning">{orders.filter(o => o.status === 'Pending').length}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-clock-fill text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Delivered</p>
                  <h3 className="fw-bold mb-0 text-success">{orders.filter(o => o.status === 'Delivered').length}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-check-circle-fill text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Revenue</p>
                  <h3 className="fw-bold mb-0 text-success">₹{orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-currency-rupee text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">SEARCH</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by Order ID, Customer, Email, Phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">STATUS</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {filterOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">DATE RANGE</label>
              <select
                className="form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
          <div className="mt-3">
            <small className="text-muted">
              Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
            </small>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 fw-semibold">Order ID</th>
                  <th className="py-3 fw-semibold">Customer</th>
                  <th className="py-3 fw-semibold">Date</th>
                  <th className="py-3 fw-semibold">Items</th>
                  <th className="py-3 fw-semibold">Amount</th>
                  <th className="py-3 fw-semibold">Payment</th>
                  <th className="py-3 fw-semibold">Phone</th>
                  <th className="py-3 fw-semibold">Address</th>
                  <th className="py-3 fw-semibold">Status</th>
                  <th className="py-3 fw-semibold">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-bottom">
                    <td className="px-4">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                        #{order.orderId}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {order.user?.profileImage ? (
                          <img 
                            src={order.user.profileImage} 
                            alt={order.user.username}
                            className="rounded-circle me-2 border"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <div 
                            className="rounded-circle me-2 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <i className="bi bi-person-fill text-primary"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold">{order.user?.username || 'N/A'}</div>
                          <small className="text-muted">{order.user?.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(order.orderDate)}</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-25 text-dark">
                        {order.orderItems?.length || 0} item(s)
                      </span>
                    </td>
                    <td>
                      <strong className="text-success">₹{order.totalAmount?.toFixed(2)}</strong>
                    </td>
                    <td>
                      {getPaymentMethodBadge(order)}
                    </td>
                    <td>
                      <small className="text-muted">{order.phone}</small>
                    </td>
                    <td>
                      <small 
                        title={order.address}
                        className="text-muted text-truncate d-inline-block"
                        style={{maxWidth: '200px'}}
                      >
                        {order.address}
                      </small>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)} px-3 py-2`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm fw-semibold"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        style={{ minWidth: '150px' }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{fontSize: '4rem', color: '#e0e0e0'}}></i>
              <p className="text-muted mt-3 mb-0">No orders found matching your filters</p>
              <button className="btn btn-link" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListOrder;
