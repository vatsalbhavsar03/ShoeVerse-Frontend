import React from 'react';

function AdmiDashBoard() {
  const stats = [
    { title: 'Total Sales', value: '$48,574', change: '+12.5%', icon: '💰', color: 'primary' },
    { title: 'Total Orders', value: '1,044', change: '+8.2%', icon: '🛒', color: 'success' },
    { title: 'Products', value: '248', change: '+3', icon: '📦', color: 'purple' }, // custom color
    { title: 'Customers', value: '892', change: '+24', icon: '👥', color: 'warning' },
  ];

  const products = [
    { id: 1, name: 'Nike Air Max 270', category: 'Running', price: 150, stock: 45, image: '👟', sales: 234 },
    { id: 2, name: 'Adidas Ultraboost', category: 'Running', price: 180, stock: 32, image: '👟', sales: 189 },
    { id: 3, name: 'Puma Suede Classic', category: 'Casual', price: 75, stock: 67, image: '👞', sales: 156 },
    { id: 4, name: 'Converse Chuck Taylor', category: 'Casual', price: 65, stock: 89, image: '👟', sales: 298 },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', product: 'Nike Air Max 270', amount: '$150', status: 'Delivered' },
    { id: '#ORD-002', customer: 'Emma Wilson', product: 'Adidas Ultraboost', amount: '$180', status: 'Processing' },
    { id: '#ORD-003', customer: 'Michael Brown', product: 'Puma Suede Classic', amount: '$75', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Sarah Davis', product: 'Converse Chuck Taylor', amount: '$65', status: 'Pending' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success text-white';
      case 'Shipped':
        return 'bg-primary text-white';
      case 'Processing':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="container my-4">
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">{stat.title}</p>
                  <h3 className="fw-bold mb-1">{stat.value}</h3>
                  <p className="text-success mb-0">📈 {stat.change}</p>
                </div>
                <div
                  className={`d-flex justify-content-center align-items-center rounded`}
                  style={{
                    backgroundColor:
                      stat.color === 'purple' ? '#8B5CF6' : '',
                    width: '50px',
                    height: '50px',
                    fontSize: '24px',
                    color: stat.color !== 'purple' ? 'white' : 'white',
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Recent Orders</h5>
              {recentOrders.map((order, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2">
                  <div>
                    <p className="mb-0 fw-semibold">{order.id}</p>
                    <p className="mb-0 text-muted small">{order.customer}</p>
                  </div>
                  <div className="text-end">
                    <p className="mb-1 fw-bold">{order.amount}</p>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">Top Products</h5>
              {products.map((product, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center bg-light rounded p-2 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '32px' }}>{product.image}</span>
                    <div>
                      <p className="mb-0 fw-semibold">{product.name}</p>
                      <p className="mb-0 text-muted small">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="mb-0 fw-bold">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdmiDashBoard;
