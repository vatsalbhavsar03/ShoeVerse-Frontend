import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Signup from "./component/Signup";
import Login from "./component/Login";
import UserDashboard from './component/user/UserDashboard';
import AdminLayout from './component/admin/AdminLayout';
import ProtectedRoute from './component/ProtectedRoute';
import ForgotPassword from './component/ForgotPassword';

import ListCategory from './component/admin/ListCategory';
import ListBrand from './component/admin/ListBrand';
import ListProduct from './component/admin/ListProduct';
import ListOrder from './component/admin/ListOrder';
import ListUser from './component/admin/ListUser';

import ProductDetail from './component/user/ProductDetail ';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* User Dashboard Route */}
        <Route
          path="/user/userDashboard"
          element={
            <ProtectedRoute allowedRole="2">
              <UserDashboard />

            </ProtectedRoute>
          }
        />
        
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Routes with Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Admin Routes */}
          <Route path="listCategory" element={<ListCategory />} />
          <Route path="listBrand" element={<ListBrand />} />
          <Route path="listProduct" element={<ListProduct />} />
          <Route path="listOrder" element={<ListOrder />} />
          <Route path="listUser" element={<ListUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;