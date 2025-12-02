import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdmiDashBoard from "./AdmiDashBoard";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "",
    profile: "",
    userId: null,
    email: "",
    phoneNo: "",
  });

  // derive currentPage from path
  const path = location.pathname.toLowerCase();
  const getCurrentPageFromPath = () => {
    if (path === "/admin" || path === "/admin/") return "dashboard";
    if (path.includes("/admin/listcategory")) return "category";
    if (path.includes("/admin/listbrand")) return "brand";
    if (path.includes("/admin/listproduct")) return "products";
    if (path.includes("/admin/listorder")) return "orders";
    if (path.includes("/admin/listuser")) return "customers";
    if (path.includes("/admin/reviews")) return "reviews";
    if (path.includes("/admin/contact")) return "contact";
    return "dashboard";
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPageFromPath());

  useEffect(() => {
    setCurrentPage(getCurrentPageFromPath());
    // load user from localStorage for header/profile
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user.userId || user.UserId || user.id || null;
        const userName = user.name || user.username || "Admin";
        let imageUrl = user.profileImage || user.ProfileImage || "";
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `https://localhost:7208/${imageUrl.replace(/^\/+/, "")}`;
        }
        setAdminData({
          name: userName,
          profile: imageUrl,
          userId,
          email: user.email || "",
          phoneNo: user.phoneNo || "",
        });
      } catch (err) {
        // ignore parse errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roleId");
    toast.info("Logged out successfully", { position: "top-right", autoClose: 1500 });
    setTimeout(() => navigate("/"), 400);
  };

  const MenuItem = ({ icon, label, page, to }) => {
    const active = currentPage === page;
    return (
      <button
        onClick={() => {
          if (to) navigate(to);
          setCurrentPage(page);
        }}
        className={`menu-item d-flex align-items-center justify-content-between btn w-100 text-start position-relative overflow-hidden ${
          active ? "active" : ""
        }`}
        style={{
          padding: sidebarOpen ? "10px 14px" : "10px",
          marginBottom: "6px",
          borderRadius: "8px",
          border: "none",
          background: active ? "rgba(13,110,253,0.08)" : "transparent",
          color: active ? "#0d6efd" : "#cbd5e1",
          fontWeight: active ? 600 : 500,
          transition: "all 0.15s ease",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <span style={{ fontSize: "1.15rem", minWidth: "24px" }}>{icon}</span>
          {sidebarOpen && <span>{label}</span>}
        </div>
      </button>
    );
  };

  return (
    <div className="d-flex vh-100" style={{ background: "#f8f9fa" }}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Sidebar */}
      <aside
        className="d-flex flex-column justify-content-between position-relative"
        style={{
          width: sidebarOpen ? "260px" : "76px",
          transition: "width 0.25s",
          background: "linear-gradient(180deg,#1a1d29 0%,#2d3142 100%)",
          color: "#fff",
          zIndex: 1000,
        }}
      >
        <div>
          <div
            className="d-flex align-items-center justify-content-between p-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 72 }}
          >
            {sidebarOpen ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#667eea,#764ba2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  👟
                </div>
                <h2 className="m-0" style={{ fontSize: 18, fontWeight: 700 }}>
                  ShoeVerse
                </h2>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>👟</div>
            )}

            <button
              className="btn p-2"
              onClick={() => setSidebarOpen((s) => !s)}
              style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "#fff", width: 36, height: 36 }}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>

          <nav className="p-3">
            <MenuItem icon="📊" label="Dashboard" page="dashboard" to="/admin" />
            <MenuItem icon="👥" label="Customers" page="customers" to="/admin/listUser" />
            <MenuItem icon="📂" label="Category" page="category" to="/admin/listCategory" />
            <MenuItem icon="🏷️" label="Brand" page="brand" to="/admin/listBrand" />
            <MenuItem icon="📦" label="Products" page="products" to="/admin/listProduct" />
            <MenuItem icon="🛒" label="Orders" page="orders" to="/admin/listOrder" />
            <MenuItem icon="⭐" label="Reviews" page="reviews" to="/admin/reviews" />
            <MenuItem icon="📩" label="Contact" page="contact" to="/admin/contact" />
          </nav>
        </div>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="btn w-100 d-flex align-items-center gap-3 text-start"
            style={{ padding: sidebarOpen ? "10px 14px" : "10px", borderRadius: 8, border: "1px solid rgba(220,53,69,0.14)", background: "rgba(220,53,69,0.06)", color: "#ff7b7b" }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <header className="py-3 px-4 d-flex justify-content-between align-items-center" style={{ background: "#fff", borderBottom: "1px solid #e9ecef", minHeight: 72 }}>
          <div>
            <h1 className="mb-1" style={{ fontSize: 20, fontWeight: 700 }}>
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
            </h1>
            <p className="mb-0 text-muted">Manage your online shoe store efficiently</p>
          </div>

          <div className="position-relative">
            <button
              className="d-flex align-items-center gap-3 btn border-0 position-relative"
              onClick={() => setProfileOpen((s) => !s)}
              style={{ padding: "8px 14px", borderRadius: 50, background: "#f8f9fa" }}
            >
              {adminData.profile ? (
                <img src={adminData.profile} alt="profile" className="rounded-circle" style={{ width: 40, height: 40, objectFit: "cover", border: "2px solid #0d6efd" }} />
              ) : (
                <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: 40, height: 40, background: "linear-gradient(135deg,#667eea,#764ba2)", color: "#fff", fontWeight: 600 }}>
                  {adminData.name ? adminData.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              <div className="d-none d-md-block text-start">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{adminData.name || "Admin"}</div>
                <div style={{ fontSize: 12, color: "#6c757d" }}>Administrator</div>
              </div>

              <span style={{ fontSize: 12, color: "#6c757d" }}>▼</span>
            </button>

            {profileOpen && (
              <div className="position-absolute end-0 mt-2 bg-white rounded shadow" style={{ minWidth: 200, zIndex: 1001 }}>
                <button className="dropdown-item py-2 px-3" onClick={() => { /* show modal or navigate to profile edit */ setProfileOpen(false); }} style={{ border: "none", background: "transparent" }}>
                  ⚙️ Edit Profile
                </button>
                <hr className="my-0" style={{ opacity: 0.08 }} />
                <button className="dropdown-item py-2 px-3 text-danger" onClick={handleLogout} style={{ border: "none", background: "transparent" }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-grow-1 overflow-auto p-4" style={{ background: "#f8f9fa" }}>
          {/* Render nested admin routes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
