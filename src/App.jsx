import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';


import Signup from "./component/Signup";
import Login from "./component/Login";
import UserDashboard from "./component/user/UserDashboard";
import Shop from "./component/user/Shop";
import Cart from "./component/user/Cart";
import WishlistPage from "./component/user/WishlistPage";
import Profile from "./component/user/Profile";
import AdminLayout from "./component/admin/AdminLayout";
import ProtectedRoute from "./component/ProtectedRoute";
import ForgotPassword from "./component/ForgotPassword";
import ProductDetail from "./component/user/ProductDetail "
import ContactUs from "./component/user/ContactUs";
import Checkout from "./component/user/Checkout";
import Orders from "./component/user/Orders";
import OrderSuccess from "./component/user/OrderSuccess";

/* Admin pages */
import ListCategory from "./component/admin/ListCategory";
import ListBrand from "./component/admin/ListBrand";
import ListProduct from "./component/admin/ListProduct";
import ListOrder from "./component/admin/ListOrder";
import ListUser from "./component/admin/ListUser";
import AdminReviews from "./component/admin/AdminReviews";
import ListContact from "./component/admin/ListContact";
import Payment from "./component/admin/Payment";
import AdmiDashBoard from "./component/admin/AdmiDashBoard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* User Routes */}
        <Route
          path="/user/userDashboard"
          element={
            <ProtectedRoute allowedRole="2">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/shop"
          element={
            <ProtectedRoute allowedRole="2">
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRole="2">
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/cart"
          element={
            <ProtectedRoute allowedRole="2">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRole="2">
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRole="2">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/contact"
          element={
            <ProtectedRoute allowedRole="2">
              <ContactUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRole="2">
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute allowedRole="2">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute allowedRole="2">
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - layout with nested admin pages */}
        {/* Admin Routes - layout with nested admin pages */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested admin routes */}
          <Route index element={<AdmiDashBoard />} />  {/* Use <Dashboard /> not {Dashboard} */}
          <Route path="admindashboard" element={<AdmiDashBoard />} />
          <Route path="listCategory" element={<ListCategory />} />
          <Route path="listBrand" element={<ListBrand />} />
          <Route path="listProduct" element={<ListProduct />} />
          <Route path="listOrder" element={<ListOrder />} />
          <Route path="listUser" element={<ListUser />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="contact" element={<ListContact />} />
          <Route path="payment" element={<Payment />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
