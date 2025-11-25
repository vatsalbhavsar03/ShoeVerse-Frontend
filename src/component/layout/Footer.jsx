import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsYoutube, BsEnvelope } from 'react-icons/bs';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add subscription logic
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-main">
        <div className="container-fluid px-4">
          <div className="row g-4">
            {/* Company Info */}
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-brand">ShoeVerse</h5>
              <p className="footer-text">
                Your ultimate destination for premium footwear. Quality shoes for every occasion.
              </p>
              <div className="social-links">
                <a href="#" className="social-icon"><BsFacebook size={20} /></a>
                <a href="#" className="social-icon"><BsInstagram size={20} /></a>
                <a href="#" className="social-icon"><BsTwitter size={20} /></a>
                <a href="#" className="social-icon"><BsYoutube size={20} /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Customer Service</h6>
              <ul className="footer-links">
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Policies</h6>
              <ul className="footer-links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/refund">Refund Policy</Link></li>
                <li><Link to="/warranty">Warranty</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-lg-3 col-md-6">
              <h6 className="footer-title">Newsletter</h6>
              <p className="footer-text mb-3">
                Subscribe to get special offers and updates.
              </p>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container-fluid px-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <p className="copyright mb-2 mb-md-0">
              © 2025 ShoeVerse. All rights reserved.
            </p>
            <div className="payment-methods">
              <span className="payment-text me-3">We Accept:</span>
              <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" width="40" />
              <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" width="40" />
              <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" width="40" />
              <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" width="40" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background: #1f2937;
          color: #d1d5db;
          margin-top: 60px;
        }

        .footer-main {
          padding: 50px 0 30px;
        }

        .footer-brand {
          color: #6366f1;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .footer-title {
          color: white;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-text {
          font-size: 14px;
          line-height: 1.6;
          color: #9ca3af;
        }

        .social-links {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .social-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #374151;
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.3s;
        }

        .social-icon:hover {
          background: #6366f1;
          transform: translateY(-3px);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: #6366f1;
          padding-left: 5px;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .newsletter-input {
          padding: 12px 15px;
          border: 1px solid #374151;
          border-radius: 6px;
          background: #374151;
          color: white;
          font-size: 14px;
        }

        .newsletter-input::placeholder {
          color: #9ca3af;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .newsletter-button {
          padding: 12px 20px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .newsletter-button:hover {
          background: #4f46e5;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          padding: 25px 0;
        }

        .copyright {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .payment-methods {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .payment-text {
          font-size: 13px;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .footer-main {
            padding: 40px 0 20px;
          }
          
          .payment-methods {
            margin-top: 15px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
