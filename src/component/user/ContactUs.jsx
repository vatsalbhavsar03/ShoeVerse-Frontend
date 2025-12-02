import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '../layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "https://localhost:7208";

const ContactUs = () => {
  const isMountedRef = useRef(true);
  const abortRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        setForm((f) => ({
          ...f,
          name: user.name ?? "",
          email: user.email ?? "",
        }));
      }
    } catch (_) {}

    return () => {
      isMountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Invalid email";

    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);

    const payload = {
      contactId: 0,
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const resp = await fetch(`${API_BASE}/api/ContactUS/AddContactUS`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (data.success) {
        toast.success(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Request failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <Layout>
      <ToastContainer />

      <section className="contact-hero">
        <div className="container-fluid px-4">
          <div className="contact-hero-inner">
            <h1>Contact Us</h1>
            <p>We’ll get back to you shortly.</p>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="container-fluid px-4">
          <div className="contact-grid">

            {/* FORM CARD */}
            <div className="contact-card">
              <h3>Send us a message</h3>

              <form onSubmit={handleSubmit}>

                <label className="form-label">Name
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${errors.name ? "has-error" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                  />
                </label>
                {errors.name && <p className="field-error">{errors.name}</p>}

                <label className="form-label">Email
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? "has-error" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </label>
                {errors.email && <p className="field-error">{errors.email}</p>}

                <label className="form-label">Subject
                  <input
                    type="text"
                    name="subject"
                    className={`form-input ${errors.subject ? "has-error" : ""}`}
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                  />
                </label>
                {errors.subject && <p className="field-error">{errors.subject}</p>}

                <label className="form-label">Message
                  <textarea
                    name="message"
                    className={`form-textarea ${errors.message ? "has-error" : ""}`}
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                  />
                </label>
                {errors.message && <p className="field-error">{errors.message}</p>}

                {/* BUTTONS FIXED */}
                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </button>

                  <button
                    type="button"
                    className="btn-reset"
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    Reset
                  </button>
                </div>

              </form>
            </div>

            {/* CONTACT INFO */}
            <aside className="contact-info">
              <div className="info-card">
                <h4>Contact Details</h4>

                <div className="info-row">
                  <strong>Email:</strong>
                  <span>support@shoeverse.com</span>
                </div>

                <div className="info-row">
                  <strong>Phone:</strong>
                  <span>+91 98765 43210</span>
                </div>

                <div className="info-row">
                  <strong>Address:</strong>
                  <span>India</span>
                </div>

                <hr />

                <h5>Business Hours</h5>
                <p>Mon–Fri: 9 AM – 6 PM</p>
                <p>Sat: 10 AM – 3 PM</p>
                <p>Sun: Closed</p>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* CSS */}
      <style>{`
        .contact-hero {
          background: linear-gradient(135deg, #667eea, #764ba2);
          text-align: center;
          color: white;
          padding: 50px 0;
        }

        .contact-main {
          background: #f9fafb;
          padding: 60px 0 100px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .contact-card {
          background: white;
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.06);
        }

        .form-label {
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .has-error {
          border-color: #ef4444 !important;
        }

        .field-error {
          color: #ef4444;
          font-size: 13px;
          margin-bottom: 8px;
        }

        /* FIX BUTTON HEIGHT + ALIGNMENT */
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          align-items: center;
        }

        .btn-submit {
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 800;
          border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-reset {
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 700;
          border: 2px solid #e5e7eb;
          background: white;
          color: #6366f1;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: auto !important;
          white-space: nowrap;
        }

        .info-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        }

        @media (max-width: 991px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .form-actions {
            flex-direction: column;
          }
          .btn-submit, .btn-reset {
            width: 100% !important;
          }
        }
      `}</style>

    </Layout>
  );
};

export default ContactUs;
