// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import Signup from "./component/Signup";
// import Login from "./component/Login";
// import UserDashboard from './component/user/UserDashboard';
// import ProductDetail from './component/user/ProductDetail ';
// import Cart from './component/user/Cart';
// import WishlistPage from './component/user/WishlistPage';
// import Profile from './component/user/Profile';
// import AdminLayout from './component/admin/AdminLayout';
// import ProtectedRoute from './component/ProtectedRoute';
// import ForgotPassword from './component/ForgotPassword';

// import ListCategory from './component/admin/ListCategory';
// import ListBrand from './component/admin/ListBrand';
// import ListProduct from './component/admin/ListProduct';
// import ListOrder from './component/admin/ListOrder';
// import ListUser from './component/admin/ListUser';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgotpassword" element={<ForgotPassword />} />

//         {/* User Routes */}
//         <Route
//           path="/user/userDashboard"
//           element={
//             <ProtectedRoute allowedRole="2">
//               <UserDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/product/:id"
//           element={
//             <ProtectedRoute allowedRole="2">
//               <ProductDetail />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/user/cart"
//           element={
//             <ProtectedRoute allowedRole="2">
//               <Cart />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/wishlist"
//           element={
//             <ProtectedRoute allowedRole="2">
//               <WishlistPage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/user/profile"
//           element={
//             <ProtectedRoute allowedRole="2">
//               <Profile />
//             </ProtectedRoute>
//           }
//         />

//         {/* Admin Routes */}
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="1">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="listCategory" element={<ListCategory />} />
//           <Route path="listBrand" element={<ListBrand />} />
//           <Route path="listProduct" element={<ListProduct />} />
//           <Route path="listOrder" element={<ListOrder />} />
//           <Route path="listUser" element={<ListUser />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Signup from "./component/Signup";
import Login from "./component/Login";
import UserDashboard from './component/user/UserDashboard';
import Shop from './component/user/Shop';
import ProductDetail from "./component/user/ProductDetail "
import Cart from './component/user/Cart';
import WishlistPage from './component/user/WishlistPage';
import Profile from './component/user/Profile';
import AdminLayout from './component/admin/AdminLayout';
import ProtectedRoute from './component/ProtectedRoute';
import ForgotPassword from './component/ForgotPassword';

import ListCategory from './component/admin/ListCategory';
import ListBrand from './component/admin/ListBrand';
import ListProduct from './component/admin/ListProduct';
import ListOrder from './component/admin/ListOrder';
import ListUser from './component/admin/ListUser';

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

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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