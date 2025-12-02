import React, { useEffect, useState } from "react";
import { BsExclamationTriangleFill, BsFolderX } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListContact = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "https://localhost:7208/api/ContactUS/GetAllSubmissions";

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // optional, if API requires auth
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(API_URL, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      } else {
        throw new Error(data.message || "No submissions found");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <ToastContainer />
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <BsExclamationTriangleFill className="me-2" />
          <div>
            <strong>Error: </strong> {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold mb-1">Contact Submissions</h2>
            <p className="text-muted mb-0">View all contact messages submitted by users</p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">All Submissions</h5>
                <span className="badge bg-primary rounded-pill">{submissions.length}</span>
              </div>

              <div className="card-body p-0">
                {submissions.length === 0 ? (
                  <div className="text-center py-5">
                    <BsFolderX style={{ fontSize: "48px", color: "#6c757d" }} />
                    <h5 className="text-muted mt-3">No submissions found</h5>
                    <p className="text-muted">Users have not submitted any messages yet</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="px-3 py-3">#</th>
                          <th className="py-3">Name</th>
                          <th className="py-3">Email</th>
                          <th className="py-3">Subject</th>
                          <th className="py-3">Message</th>
                          <th className="py-3">Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {submissions.map((item, index) => (
                          <tr key={item.contactId ?? index}>
                            <td className="px-3 py-3 text-muted">{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.subject}</td>
                            <td style={{ maxWidth: 380, whiteSpace: "pre-wrap" }}>{item.message}</td>
                            <td>{item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN") : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListContact;
