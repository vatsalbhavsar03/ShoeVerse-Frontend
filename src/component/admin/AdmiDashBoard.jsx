import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AdmiDashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalPayments: 0,
    successfulPayments: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      let orders = [];
      let payments = [];
      let totalUsers = 0;
      let totalProducts = 0;

      // Fetch orders
      try {
        const ordersRes = await axios.get('https://localhost:7208/api/Order/GetAllOrders');
        orders = ordersRes.data.orders || [];
      } catch (error) {
        console.error('Error fetching orders:', error);
        orders = [];
      }

      // Fetch payments
      try {
        const paymentsRes = await axios.get('https://localhost:7208/api/Payment/GetAllPayments');
        payments = paymentsRes.data.payments || [];
      } catch (error) {
        console.error('Error fetching payments:', error);
        payments = [];
      }

      // Fetch users - FIXED to match ListUser component
      try {
        const usersRes = await axios.get('https://localhost:7208/api/User/GetUser');

        if (usersRes.data.success && (usersRes.data.Data || usersRes.data.data)) {
          const usersList = usersRes.data.Data || usersRes.data.data;
          totalUsers = Array.isArray(usersList) ? usersList.length : 0;
        } else {
          totalUsers = 0;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        totalUsers = 0;
      }

      // Fetch products - try multiple endpoint names
      try {
        const productsRes = await axios.get('https://localhost:7208/api/Product/GetAllProducts');
        totalProducts = productsRes.data.products?.length || productsRes.data.Data?.length || 0;
      } catch (error1) {
        try {
          const productsRes = await axios.get('https://localhost:7208/api/Product/GetAllProduct');
          totalProducts = productsRes.data.products?.length || productsRes.data.Data?.length || 0;
        } catch (error2) {
          console.error('Error fetching products:', error2);
          totalProducts = 0;
        }
      }

      // Process orders data
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Pending').length;
      const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      const recentOrdersList = orders.slice(0, 5);

      // Process payments data
      const totalPayments = payments.length;
      const successfulPayments = payments.filter(p => p.paymentStatus === 'Paid').length;
      const recentPaymentsList = payments.slice(0, 5);

      // Update state
      setStats({
        totalOrders,
        totalRevenue,
        totalUsers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        totalPayments,
        successfulPayments
      });

      setRecentOrders(recentOrdersList);
      setRecentPayments(recentPaymentsList);

      toast.success('Dashboard loaded!', {
        position: "top-right",
        autoClose: 1500
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard', {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'Pending': 'badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning',
      'Processing': 'badge rounded-pill bg-info bg-opacity-10 text-info border border-info',
      'Paid': 'badge rounded-pill bg-success bg-opacity-10 text-success border border-success',
      'Shipped': 'badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary',
      'Delivered': 'badge rounded-pill bg-success bg-opacity-10 text-success border border-success',
      'Cancelled': 'badge rounded-pill bg-danger bg-opacity-10 text-danger border border-danger'
    };
    return statusClasses[status] || 'badge bg-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <ToastContainer />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-0" style={{ color: '#2c3e50' }}>Dashboard Overview</h1>
          <p className="text-muted mb-0">Track your business performance</p>
        </div>
        <button className="btn btn-outline-primary rounded-pill px-4" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Data
        </button>
      </div>

      {/* Stats Grid - Modern Cards */}
      <div className="row g-4 mb-4">
        {/* Revenue Card */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 rounded-4 overflow-hidden" style={{ height: '160px' }}>
            <div className="card-body position-relative" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 rounded-3 p-2">
                    <i className="bi bi-currency-rupee fs-3"></i>
                  </div>
                  <span className="badge bg-white bg-opacity-25 text-white">
                    <i className="bi bi-graph-up-arrow me-1"></i>
                    +12%
                  </span>
                </div>
                <h6 className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Total Revenue</h6>
                <h2 className="fw-bold mb-0">₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 rounded-4 overflow-hidden" style={{ height: '160px' }}>
            <div className="card-body position-relative" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 rounded-3 p-2">
                    <i className="bi bi-bag-check-fill fs-3"></i>
                  </div>
                  <span className="badge bg-white bg-opacity-25 text-white">
                    {stats.pendingOrders} pending
                  </span>
                </div>
                <h6 className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Total Orders</h6>
                <h2 className="fw-bold mb-0">{stats.totalOrders}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 rounded-4 overflow-hidden" style={{ height: '160px' }}>
            <div className="card-body position-relative" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div className="text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 rounded-3 p-2">
                    <i className="bi bi-people-fill fs-3"></i>
                  </div>
                  <span className="badge bg-white bg-opacity-25 text-white">
                    Active
                  </span>
                </div>
                <h6 className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Total Customers</h6>
                <h2 className="fw-bold mb-0">{stats.totalUsers}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 rounded-4 overflow-hidden" style={{ height: '160px' }}>
            <div className="card-body position-relative" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <div className="text-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-white bg-opacity-25 rounded-3 p-2">
                    <i className="bi bi-box-seam-fill fs-3"></i>
                  </div>
                  <span className="badge bg-white bg-opacity-25 text-white">
                    In stock
                  </span>
                </div>
                <h6 className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Total Products</h6>
                <h2 className="fw-bold mb-0">{stats.totalProducts}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-6">
          <div className="card border-0 rounded-4 shadow-sm hover-lift" style={{ transition: 'transform 0.2s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-clock-history text-warning" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.pendingOrders}</h3>
              <p className="text-muted mb-0 small">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-6">
          <div className="card border-0 rounded-4 shadow-sm hover-lift" style={{ transition: 'transform 0.2s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.deliveredOrders}</h3>
              <p className="text-muted mb-0 small">Delivered</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-6">
          <div className="card border-0 rounded-4 shadow-sm hover-lift" style={{ transition: 'transform 0.2s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-wallet2 text-primary" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.totalPayments}</h3>
              <p className="text-muted mb-0 small">Total Payments</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-6">
          <div className="card border-0 rounded-4 shadow-sm hover-lift" style={{ transition: 'transform 0.2s' }}>
            <div className="card-body text-center py-4">
              <div className="mb-3">
                <i className="bi bi-cash-stack text-success" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h3 className="fw-bold mb-1">{stats.successfulPayments}</h3>
              <p className="text-muted mb-0 small">Successful</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-8">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">Recent Orders</h5>
                  <p className="text-muted small mb-0">Latest customer purchases</p>
                </div>
                <Link to="/admin/admindashboard/listOrder" className="btn btn-sm btn-primary rounded-pill px-3">
                  View All <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="px-4 py-3 border-0 text-muted small fw-semibold">ORDER</th>
                      <th className="py-3 border-0 text-muted small fw-semibold">CUSTOMER</th>
                      <th className="py-3 border-0 text-muted small fw-semibold">AMOUNT</th>
                      <th className="py-3 border-0 text-muted small fw-semibold">STATUS</th>
                      <th className="py-3 border-0 text-muted small fw-semibold">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.orderId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td className="px-4 py-3">
                            <span className="badge bg-light text-primary fw-semibold px-3 py-2 rounded-pill">
                              #{order.orderId}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                                style={{ width: '36px', height: '36px' }}>
                                <i className="bi bi-person-fill text-primary"></i>
                              </div>
                              <div>
                                <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{order.user?.username || 'N/A'}</div>
                                <small className="text-muted">{order.user?.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="fw-bold text-success">₹{order.totalAmount?.toFixed(2)}</span>
                          </td>
                          <td className="py-3">
                            <span className={getStatusBadgeClass(order.status)}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <small className="text-muted">{formatDate(order.orderDate)}</small>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                          <p className="text-muted mt-2 mb-0">No recent orders</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-1">Recent Payments</h5>
                  <p className="text-muted small mb-0">Latest transactions</p>
                </div>
                <Link to="/admin/admindashboard/payment" className="text-primary text-decoration-none small fw-semibold">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body px-4" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {recentPayments.length > 0 ? (
                <div>
                  {recentPayments.map((payment, index) => (
                    <div key={payment.paymentId}
                      className={`py-3 ${index !== recentPayments.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge bg-light text-dark px-2 py-1 small">#{payment.paymentId}</span>
                            <span className="badge bg-primary px-2 py-1 small">{payment.paymentMethod}</span>
                          </div>
                          <p className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>{payment.userName}</p>
                          <small className="text-muted">{formatDate(payment.paymentDate)}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success mb-1">₹{payment.amount?.toFixed(2)}</div>
                          <span className={getStatusBadgeClass(payment.paymentStatus)}>
                            {payment.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-credit-card text-muted" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                  <p className="text-muted mt-2 mb-0">No recent payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-bar-chart-line me-2 text-info"></i>
                Performance Metrics
              </h5>
              <div className="row text-center g-4">
                <div className="col-md-3">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#f0f7ff' }}>
                    <h3 className="fw-bold text-primary mb-1">
                      {((stats.deliveredOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%
                    </h3>
                    <p className="text-muted mb-0 small">Delivery Success Rate</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#f0fff4' }}>
                    <h3 className="fw-bold text-success mb-1">
                      {((stats.successfulPayments / stats.totalPayments) * 100 || 0).toFixed(1)}%
                    </h3>
                    <p className="text-muted mb-0 small">Payment Success Rate</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#fffbf0' }}>
                    <h3 className="fw-bold text-warning mb-1">
                      ₹{(stats.totalRevenue / stats.totalOrders || 0).toFixed(0)}
                    </h3>
                    <p className="text-muted mb-0 small">Average Order Value</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3 rounded-3" style={{ backgroundColor: '#f0f9ff' }}>
                    <h3 className="fw-bold text-info mb-1">
                      {(stats.totalOrders / stats.totalUsers || 0).toFixed(1)}
                    </h3>
                    <p className="text-muted mb-0 small">Orders per Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-lift:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default AdmiDashBoard;
