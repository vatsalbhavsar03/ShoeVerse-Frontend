import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('all');

  const statusOptions = ['Paid', 'Pending', 'Failed', 'Refunded'];
  const methodOptions = ['All', 'Razorpay', 'COD', 'Card'];

  useEffect(() => {
    fetchAllPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, methodFilter, dateFilter]);

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://localhost:7208/api/Payment/GetAllPayments');
      
      if (response.data.success) {
        setPayments(response.data.payments);
        toast.success(`Loaded ${response.data.payments.length} payments successfully!`, {
          position: "top-right",
          autoClose: 2000
        });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments. Please try again.', {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(payment => payment.paymentStatus === statusFilter);
    }

    // Method filter
    if (methodFilter !== 'All') {
      filtered = filtered.filter(payment => payment.paymentMethod === methodFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.paymentId.toString().includes(searchTerm) ||
        payment.orderId.toString().includes(searchTerm) ||
        payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'today') {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.toDateString() === now.toDateString();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(payment => new Date(payment.paymentDate) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(payment => new Date(payment.paymentDate) >= monthAgo);
    }

    setFilteredPayments(filtered);
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
      'Paid': 'bg-success',
      'Pending': 'bg-warning text-dark',
      'Failed': 'bg-danger',
      'Refunded': 'bg-info'
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const getMethodBadgeClass = (method) => {
    const methodClasses = {
      'Razorpay': 'bg-primary',
      'COD': 'bg-secondary',
      'PayPal': 'bg-info',
      'Card': 'bg-dark'
    };
    return methodClasses[method] || 'bg-secondary';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setMethodFilter('All');
    setDateFilter('all');
    toast.info('Filters cleared', {
      position: "top-right",
      autoClose: 2000
    });
  };

  const exportToCSV = () => {
    const headers = ['Payment ID', 'Order ID', 'Customer', 'Method', 'Transaction ID', 'Status', 'Amount', 'Date'];
    const csvData = filteredPayments.map(p => [
      p.paymentId,
      p.orderId,
      p.userName,
      p.paymentMethod,
      p.transactionId,
      p.paymentStatus,
      p.amount,
      formatDate(p.paymentDate)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast.success('Payments exported successfully!', {
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
        <p className="mt-3 text-muted">Loading payments...</p>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successfulPayments = payments.filter(p => p.paymentStatus === 'Paid');
  const successfulAmount = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="container-fluid mt-4 px-4">
      <ToastContainer />
      
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-credit-card-fill me-2 text-primary"></i>
            Payment Management
          </h2>
          <p className="text-muted">Track and manage all payment transactions</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-success" onClick={exportToCSV}>
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Export CSV
          </button>
          <button className="btn btn-primary" onClick={fetchAllPayments}>
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
                  <p className="text-muted mb-1 small">Total Payments</p>
                  <h3 className="fw-bold mb-0">{payments.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-wallet2 text-primary fs-4"></i>
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
                  <p className="text-muted mb-1 small">Successful</p>
                  <h3 className="fw-bold mb-0 text-success">{successfulPayments.length}</h3>
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
                  <p className="text-muted mb-1 small">Total Amount</p>
                  <h3 className="fw-bold mb-0 text-primary">₹{totalAmount.toFixed(2)}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-cash-stack text-primary fs-4"></i>
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
                  <p className="text-muted mb-1 small">Successful Amount</p>
                  <h3 className="fw-bold mb-0 text-success">₹{successfulAmount.toFixed(2)}</h3>
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
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-muted">SEARCH</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Payment ID, Order ID, Customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">STATUS</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold text-muted">METHOD</label>
              <select
                className="form-select"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                {methodOptions.map((method) => (
                  <option key={method} value={method}>
                    {method === 'All' ? 'All Methods' : method}
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
                Clear
              </button>
            </div>
          </div>
          <div className="mt-3">
            <small className="text-muted">
              Showing <strong>{filteredPayments.length}</strong> of <strong>{payments.length}</strong> payments
            </small>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 fw-semibold">Payment ID</th>
                  <th className="py-3 fw-semibold">Order ID</th>
                  <th className="py-3 fw-semibold">Customer</th>
                  <th className="py-3 fw-semibold">Payment Method</th>
                  <th className="py-3 fw-semibold">Transaction ID</th>
                  <th className="py-3 fw-semibold">Amount</th>
                  <th className="py-3 fw-semibold">Status</th>
                  <th className="py-3 fw-semibold">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.paymentId} className="border-bottom">
                    <td className="px-4">
                      <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                        #{payment.paymentId}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary fw-semibold">
                        Order #{payment.orderId}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        
                        <div className="fw-semibold">{payment.userName || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getMethodBadgeClass(payment.paymentMethod)} px-3 py-2`}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted font-monospace">{payment.transactionId}</small>
                    </td>
                    <td>
                      <strong className="text-success fs-6">₹{payment.amount?.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(payment.paymentStatus)} px-3 py-2`}>
                        <i className={`bi ${payment.paymentStatus === 'Paid' ? 'bi-check-circle-fill' : 'bi-clock-fill'} me-1`}></i>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{formatDate(payment.paymentDate)}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-credit-card" style={{fontSize: '4rem', color: '#e0e0e0'}}></i>
              <p className="text-muted mt-3 mb-0">No payments found matching your filters</p>
              <button className="btn btn-link" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
