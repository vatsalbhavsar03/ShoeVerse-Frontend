import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./component/Signup";
import Login from "./component/Login"; // Capitalize to match filename convention
import UserDashboard from './component/user/UserDashboard';
import AdminLayout from './component/admin/AdminLayout';
import ProtectedRoute from './component/ProtectedRoute';
import ForgotPassword from './component/ForgotPassword';
function App() {
  return (
    <Router>
      <Routes>
        {/* public route */}
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

          {/* Admin Routes with Layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="1">
                <AdminLayout />
              </ProtectedRoute>
            }
          ></Route>
      </Routes>
    </Router>
  );
}

export default App;
