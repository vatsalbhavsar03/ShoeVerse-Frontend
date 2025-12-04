// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Layout from '../layout/Layout';
// import { BsShieldCheck, BsCreditCard2Front, BsCash, BsArrowLeft } from 'react-icons/bs';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Checkout = () => {
//     const navigate = useNavigate();
//     const [cartItems, setCartItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [processingOrder, setProcessingOrder] = useState(false);
//     const [user, setUser] = useState(null);

//     // Form state
//     const [formData, setFormData] = useState({
//         phone: '',
//         address: '',
//         paymentMethod: 'razorpay' // 'razorpay' or 'cod'
//     });

//     useEffect(() => {
//         const userData = JSON.parse(localStorage.getItem('user'));
//         if (!userData || !userData.userId) {
//             toast.error('Please login to checkout');
//             navigate('/login');
//             return;
//         }

//         setUser(userData);
//         fetchCart(userData.userId);

//         // Load Razorpay script
//         loadRazorpayScript();
//     }, [navigate]);

//     const loadRazorpayScript = () => {
//         return new Promise((resolve) => {
//             const script = document.createElement('script');
//             script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//             script.onload = () => resolve(true);
//             script.onerror = () => resolve(false);
//             document.body.appendChild(script);
//         });
//     };

//     const fetchCart = async (userId) => {
//         try {
//             setLoading(true);
//             const response = await fetch(`https://localhost:7208/api/Cart/user/${userId}`);

//             if (!response.ok) throw new Error('Failed to fetch cart');

//             const data = await response.json();

//             if (data.success && data.data) {
//                 setCartItems(data.data.items || []);
//             } else if (data.cartItems) {
//                 setCartItems(data.cartItems);
//             } else {
//                 setCartItems([]);
//             }

//             if (!data.data?.items?.length && !data.cartItems?.length) {
//                 toast.info('Your cart is empty');
//                 navigate('/cart');
//             }
//         } catch (error) {
//             console.error('Error fetching cart:', error);
//             toast.error('Failed to load cart');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const calculateSubtotal = () => {
//         return cartItems.reduce((total, item) => {
//             const price = item.unitPrice || item.product?.price || 0;
//             return total + price * item.quantity;
//         }, 0);
//     };

//     const calculateTotal = () => {
//         return calculateSubtotal();
//     };

//     const validateForm = () => {
//         if (!formData.phone.trim()) {
//             toast.error('Please enter your phone number');
//             return false;
//         }
//         if (formData.phone.length < 10) {
//             toast.error('Please enter a valid 10-digit phone number');
//             return false;
//         }
//         if (!formData.address.trim()) {
//             toast.error('Please enter your delivery address');
//             return false;
//         }
//         return true;
//     };

//     const createOrder = async () => {
//         if (!validateForm()) return;

//         try {
//             setProcessingOrder(true);

//             const orderPayload = {
//                 userId: user.userId,
//                 phone: formData.phone,
//                 address: formData.address,
//                 paymentMethod: formData.paymentMethod
//             };

//             const response = await fetch('https://localhost:7208/api/Order/CreateOrder', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(orderPayload)
//             });

//             if (!response.ok) throw new Error('Failed to create order');

//             const result = await response.json();

//             if (result.success) {
//                 return result.orderId;
//             } else {
//                 throw new Error(result.message || 'Failed to create order');
//             }
//         } catch (error) {
//             console.error('Error creating order:', error);
//             toast.error(error.message);
//             setProcessingOrder(false);
//             return null;
//         }
//     };

//     const handlePaymentSuccess = async (razorpayResponse, orderId) => {
//         try {
//             // Create payment record
//             const paymentPayload = {
//                 orderId: orderId,
//                 paymentMethod: 'Razorpay',
//                 transactionId: razorpayResponse.razorpay_payment_id,
//                 amount: calculateTotal(),
//                 paymentStatus: 'Paid'
//             };

//             const response = await fetch('https://localhost:7208/api/Payment/CreatePayment', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(paymentPayload)
//             });

//             const result = await response.json();

//             if (result.success) {
//                 toast.success('Payment successful! Order confirmed.');
//                 window.dispatchEvent(new Event('cartUpdated'));

//                 // Redirect to Thank You page with order details
//                 setTimeout(() => {
//                     navigate('/order-success', {
//                         state: {
//                             orderDetails: {
//                                 orderId: orderId,
//                                 totalAmount: calculateTotal(),
//                                 paymentMethod: 'Razorpay',
//                                 paymentStatus: 'Paid',
//                                 transactionId: razorpayResponse.razorpay_payment_id
//                             }
//                         }
//                     });
//                 }, 1000);
//             } else {
//                 toast.error('Payment recorded but confirmation failed');
//                 setProcessingOrder(false);
//             }
//         } catch (error) {
//             console.error('Error recording payment:', error);
//             toast.error('Payment successful but failed to record');
//             setProcessingOrder(false);
//         }
//     };

//     const handleRazorpayPayment = async () => {
//         const orderId = await createOrder();
//         if (!orderId) return;

//         const scriptLoaded = await loadRazorpayScript();
//         if (!scriptLoaded) {
//             toast.error('Failed to load Razorpay. Please try again.');
//             setProcessingOrder(false);
//             return;
//         }

//         const options = {
//             key: 'rzp_test_Rn8Ex6HXTGRPIx', // Your Razorpay Test Key
//             amount: calculateTotal() * 100, // Amount in paise
//             currency: 'INR',
//             name: 'Shoe-Verse',
//             description: `Order #${orderId}`,
//             // image: '/logo.png', // Optional: Add your logo
//             order_id: '', // We're using direct payment, not order API
//             handler: function (response) {
//                 handlePaymentSuccess(response, orderId);
//             },
//             prefill: {
//                 name: user.username || user.name,
//                 email: user.email,
//                 contact: formData.phone
//             },
//             notes: {
//                 orderId: orderId,
//                 address: formData.address
//             },
//             theme: {
//                 color: '#6366f1'
//             },
//             modal: {
//                 ondismiss: function () {
//                     setProcessingOrder(false);
//                     toast.info('Payment cancelled');
//                 }
//             }
//         };

//         const razorpay = new window.Razorpay(options);
//         razorpay.open();
//     };

//     const handleCODPayment = async () => {
//         const orderId = await createOrder();
//         if (!orderId) return;

//         try {
//             // Create COD payment record
//             const paymentPayload = {
//                 orderId: orderId,
//                 paymentMethod: 'COD',
//                 transactionId: `COD_${orderId}_${Date.now()}`,
//                 amount: calculateTotal(),
//                 paymentStatus: 'Pending'
//             };

//             const response = await fetch('https://localhost:7208/api/Payment/CreatePayment', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(paymentPayload)
//             });

//             const result = await response.json();

//             if (result.success) {
//                 toast.success('Order placed successfully!');
//                 window.dispatchEvent(new Event('cartUpdated'));

//                 // Redirect to Thank You page with order details
//                 setTimeout(() => {
//                     navigate('/order-success', {
//                         state: {
//                             orderDetails: {
//                                 orderId: orderId,
//                                 totalAmount: calculateTotal(),
//                                 paymentMethod: 'Cash on Delivery',
//                                 paymentStatus: 'Pending'
//                             }
//                         }
//                     });
//                 }, 1000);
//             } else {
//                 toast.error(result.message || 'Failed to place order');
//                 setProcessingOrder(false);
//             }
//         } catch (error) {
//             console.error('Error placing COD order:', error);
//             toast.error('Failed to place order');
//             setProcessingOrder(false);
//         }
//     };

//     const handlePlaceOrder = async (e) => {
//         e.preventDefault();

//         if (formData.paymentMethod === 'razorpay') {
//             await handleRazorpayPayment();
//         } else {
//             await handleCODPayment();
//         }
//     };

//     const getImageUrl = (item) => {
//         if (item.colorImageUrl) {
//             return `https://localhost:7208${item.colorImageUrl}`;
//         }
//         if (item.color?.imageUrl) {
//             return `https://localhost:7208${item.color.imageUrl}`;
//         }
//         return 'https://via.placeholder.com/80x80?text=No+Image';
//     };

//     const getProductName = (item) => {
//         return item.productName || item.product?.name || 'Product';
//     };

//     const getPrice = (item) => {
//         return item.unitPrice || item.product?.price || 0;
//     };

//     if (loading) {
//         return (
//             <Layout>
//                 <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//                     <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             </Layout>
//         );
//     }

//     return (
//         <Layout>
//             <ToastContainer position="top-right" autoClose={3000} />

//             <div className="checkout-container">
//                 <div className="container py-5">
//                     {/* Header */}
//                     <div className="checkout-header">
//                         <button className="back-btn" onClick={() => navigate('/cart')}>
//                             <BsArrowLeft size={20} />
//                         </button>
//                         <h2>Checkout</h2>
//                     </div>

//                     <div className="row">
//                         {/* Checkout Form */}
//                         <div className="col-lg-7">
//                             <form onSubmit={handlePlaceOrder}>
//                                 {/* Delivery Information */}
//                                 <div className="checkout-section">
//                                     <h4>Delivery Information</h4>

//                                     <div className="form-group mb-3">
//                                         <label htmlFor="phone">Phone Number *</label>
//                                         <input
//                                             type="tel"
//                                             id="phone"
//                                             name="phone"
//                                             className="form-control"
//                                             placeholder="Enter 10-digit mobile number"
//                                             value={formData.phone}
//                                             onChange={handleInputChange}
//                                             maxLength="10"
//                                             pattern="[0-9]{10}"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="form-group mb-3">
//                                         <label htmlFor="address">Delivery Address *</label>
//                                         <textarea
//                                             id="address"
//                                             name="address"
//                                             className="form-control"
//                                             rows="4"
//                                             placeholder="Enter your complete delivery address"
//                                             value={formData.address}
//                                             onChange={handleInputChange}
//                                             required
//                                         ></textarea>
//                                     </div>
//                                 </div>

//                                 {/* Payment Method */}
//                                 <div className="checkout-section">
//                                     <h4>Payment Method</h4>

//                                     <div className="payment-methods">
//                                         <div
//                                             className={`payment-option ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}
//                                             onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
//                                         >
//                                             <input
//                                                 type="radio"
//                                                 id="razorpay"
//                                                 name="paymentMethod"
//                                                 value="razorpay"
//                                                 checked={formData.paymentMethod === 'razorpay'}
//                                                 onChange={handleInputChange}
//                                             />
//                                             <label htmlFor="razorpay">
//                                                 <BsCreditCard2Front size={24} />
//                                                 <div>
//                                                     <strong>Pay Online (Razorpay)</strong>
//                                                     <p>Credit/Debit Card, UPI, Net Banking</p>
//                                                 </div>
//                                             </label>
//                                         </div>

//                                         <div
//                                             className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
//                                             onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
//                                         >
//                                             <input
//                                                 type="radio"
//                                                 id="cod"
//                                                 name="paymentMethod"
//                                                 value="cod"
//                                                 checked={formData.paymentMethod === 'cod'}
//                                                 onChange={handleInputChange}
//                                             />
//                                             <label htmlFor="cod">
//                                                 <BsCash size={24} />
//                                                 <div>
//                                                     <strong>Cash on Delivery</strong>
//                                                     <p>Pay when you receive</p>
//                                                 </div>
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="btn btn-primary btn-lg w-100 mt-4"
//                                     disabled={processingOrder}
//                                 >
//                                     {processingOrder ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         <>
//                                             {formData.paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'}
//                                         </>
//                                     )}
//                                 </button>
//                             </form>
//                         </div>

//                         {/* Order Summary */}
//                         <div className="col-lg-5">
//                             <div className="order-summary-checkout">
//                                 <h4>Order Summary</h4>

//                                 {/* Cart Items */}
//                                 <div className="checkout-items">
//                                     {cartItems.map((item) => (
//                                         <div key={item.cartItemId} className="checkout-item">
//                                             <img
//                                                 src={getImageUrl(item)}
//                                                 alt={getProductName(item)}
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
//                                                 }}
//                                             />
//                                             <div className="item-details">
//                                                 <h6>{getProductName(item)}</h6>
//                                                 <p>Qty: {item.quantity}</p>
//                                             </div>
//                                             <div className="item-price">
//                                                 ₹{(getPrice(item) * item.quantity).toFixed(2)}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 <hr />

//                                 {/* Price Breakdown */}
//                                 <div className="summary-row">
//                                     <span>Subtotal ({cartItems.length} items)</span>
//                                     <span>₹{calculateSubtotal().toFixed(2)}</span>
//                                 </div>

//                                 <div className="summary-row">
//                                     <span>Shipping</span>
//                                     <span className="text-success fw-bold">Free</span>
//                                 </div>

//                                 <div className="summary-row">
//                                     <span>Tax (GST)</span>
//                                     <span>₹0.00</span>
//                                 </div>

//                                 <hr />

//                                 <div className="summary-row total">
//                                     <span>Total Amount</span>
//                                     <span>₹{calculateTotal().toFixed(2)}</span>
//                                 </div>

//                                 {/* Security Badge */}
//                                 <div className="security-badge">
//                                     <BsShieldCheck size={20} />
//                                     <span>100% Secure Payments</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style>{`
//         .checkout-container {
//           background: #f9fafb;
//           min-height: calc(100vh - 200px);
//         }

//         .checkout-header {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .back-btn {
//           background: white;
//           border: 2px solid #e5e7eb;
//           border-radius: 50%;
//           width: 45px;
//           height: 45px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.3s;
//           color: #6b7280;
//         }

//         .back-btn:hover {
//           background: #f3f4f6;
//           transform: translateX(-3px);
//           color: #6366f1;
//         }

//         .checkout-header h2 {
//           margin: 0;
//           font-weight: 700;
//           color: #1f2937;
//         }

//         .checkout-section {
//           background: white;
//           border-radius: 16px;
//           padding: 30px;
//           margin-bottom: 20px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//         }

//         .checkout-section h4 {
//           font-weight: 700;
//           margin-bottom: 20px;
//           color: #1f2937;
//         }

//         .form-group label {
//           font-weight: 600;
//           color: #374151;
//           margin-bottom: 8px;
//           display: block;
//         }

//         .form-control {
//           border: 2px solid #e5e7eb;
//           border-radius: 8px;
//           padding: 12px 16px;
//           font-size: 15px;
//           transition: all 0.3s;
//         }

//         .form-control:focus {
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
//           outline: none;
//         }

//         .payment-methods {
//           display: flex;
//           flex-direction: column;
//           gap: 15px;
//         }

//         .payment-option {
//           border: 2px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 20px;
//           cursor: pointer;
//           transition: all 0.3s;
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .payment-option:hover {
//           border-color: #d1d5db;
//           background: #f9fafb;
//         }

//         .payment-option.active {
//           border-color: #6366f1;
//           background: rgba(99, 102, 241, 0.05);
//         }

//         .payment-option input[type="radio"] {
//           width: 20px;
//           height: 20px;
//           cursor: pointer;
//         }

//         .payment-option label {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//           cursor: pointer;
//           margin: 0;
//           flex: 1;
//         }

//         .payment-option label svg {
//           color: #6366f1;
//         }

//         .payment-option label div strong {
//           display: block;
//           color: #1f2937;
//           margin-bottom: 4px;
//         }

//         .payment-option label div p {
//           color: #6b7280;
//           font-size: 14px;
//           margin: 0;
//         }

//         .order-summary-checkout {
//           background: white;
//           border-radius: 16px;
//           padding: 30px;
//           position: sticky;
//           top: 120px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//         }

//         .order-summary-checkout h4 {
//           font-weight: 700;
//           margin-bottom: 20px;
//           color: #1f2937;
//         }

//         .checkout-items {
//           max-height: 300px;
//           overflow-y: auto;
//           margin-bottom: 20px;
//         }

//         .checkout-item {
//           display: flex;
//           gap: 15px;
//           padding: 15px 0;
//           border-bottom: 1px solid #f3f4f6;
//         }

//         .checkout-item:last-child {
//           border-bottom: none;
//         }

//         .checkout-item img {
//           width: 80px;
//           height: 80px;
//           object-fit: cover;
//           border-radius: 8px;
//           border: 2px solid #f3f4f6;
//         }

//         .checkout-item .item-details {
//           flex: 1;
//         }

//         .checkout-item .item-details h6 {
//           font-size: 15px;
//           font-weight: 600;
//           color: #1f2937;
//           margin-bottom: 5px;
//         }

//         .checkout-item .item-details p {
//           font-size: 13px;
//           color: #6b7280;
//           margin: 0;
//         }

//         .checkout-item .item-price {
//           font-weight: 700;
//           color: #6366f1;
//           font-size: 16px;
//         }

//         .summary-row {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 15px;
//           font-size: 15px;
//           color: #6b7280;
//         }

//         .summary-row.total {
//           font-size: 22px;
//           font-weight: 700;
//           color: #1f2937;
//         }

//         hr {
//           margin: 20px 0;
//           border-color: #e5e7eb;
//         }

//         .security-badge {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           margin-top: 20px;
//           padding-top: 20px;
//           border-top: 1px solid #e5e7eb;
//           color: #10b981;
//           font-weight: 600;
//         }

//         .btn {
//           padding: 14px 24px;
//           font-weight: 600;
//           border-radius: 8px;
//           transition: all 0.3s;
//           font-size: 16px;
//         }

//         .btn-primary {
//           background: #6366f1;
//           border: none;
//         }

//         .btn-primary:hover:not(:disabled) {
//           background: #4f46e5;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
//         }

//         .btn-primary:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         @media (max-width: 768px) {
//           .order-summary-checkout {
//             position: static;
//             margin-top: 20px;
//           }

//           .checkout-section {
//             padding: 20px;
//           }

//           .payment-option label {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 10px;
//           }
//         }
//       `}</style>
//         </Layout>
//     );
// };

// export default Checkout;

















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { BsShieldCheck, BsCreditCard2Front, BsCash, BsArrowLeft } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingOrder, setProcessingOrder] = useState(false);
    const [user, setUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        paymentMethod: 'razorpay' // 'razorpay' or 'cod'
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.userId) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        setUser(userData);
        fetchCart(userData.userId);

        // Load Razorpay script
        loadRazorpayScript();
    }, [navigate]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
                return resolve(true);
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const fetchCart = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`https://localhost:7208/api/Cart/user/${userId}`);

            if (!response.ok) throw new Error('Failed to fetch cart');

            const data = await response.json();

            if (data.success && data.data) {
                setCartItems(data.data.items || []);
            } else if (data.cartItems) {
                setCartItems(data.cartItems);
            } else {
                setCartItems([]);
            }

            if (!data.data?.items?.length && !data.cartItems?.length) {
                toast.info('Your cart is empty');
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.unitPrice || item.product?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const validateForm = () => {
        if (!formData.phone.trim()) {
            toast.error('Please enter your phone number');
            return false;
        }
        if (formData.phone.length < 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.address.trim()) {
            toast.error('Please enter your delivery address');
            return false;
        }
        return true;
    };

    const createOrder = async () => {
        if (!validateForm()) return;

        try {
            setProcessingOrder(true);

            const orderPayload = {
                userId: user.userId,
                phone: formData.phone,
                address: formData.address,
                paymentMethod: formData.paymentMethod,
                // include items so back-end knows exact requested items
                items: cartItems.map(ci => ({
                    productId: ci.productId || ci.product?.productId,
                    colorId: ci.colorId,
                    sizeId: ci.sizeId,
                    quantity: ci.quantity
                }))
            };

            const response = await fetch('https://localhost:7208/api/Order/CreateOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    const err = await response.json();
                    throw new Error(err.message || 'Failed to create order');
                }
                throw new Error('Failed to create order');
            }

            const result = await response.json();

            if (result.success) {
                // Return orderId and also optional items returned by backend
                return { orderId: result.orderId, items: result.items || orderPayload.items };
            } else {
                throw new Error(result.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.message || 'Failed to create order');
            setProcessingOrder(false);
            return null;
        }
    };

    const handlePaymentSuccess = async (razorpayResponse, orderId, orderedItems) => {
        try {
            // Create payment record
            const paymentPayload = {
                orderId: orderId,
                paymentMethod: 'Razorpay',
                transactionId: razorpayResponse.razorpay_payment_id,
                amount: calculateTotal(),
                paymentStatus: 'Paid'
            };

            const response = await fetch('https://localhost:7208/api/Payment/CreatePayment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentPayload)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Payment successful! Order confirmed.');

                // dispatch detailed event so product pages can refresh only relevant items
                window.dispatchEvent(new CustomEvent('productStockChanged', { detail: { orderId, items: orderedItems } }));

                // legacy event
                window.dispatchEvent(new Event('cartUpdated'));

                // Redirect to Thank You page with order details
                setTimeout(() => {
                    navigate('/order-success', {
                        state: {
                            orderDetails: {
                                orderId: orderId,
                                totalAmount: calculateTotal(),
                                paymentMethod: 'Razorpay',
                                paymentStatus: 'Paid',
                                transactionId: razorpayResponse.razorpay_payment_id
                            }
                        }
                    });
                }, 1000);
            } else {
                toast.error('Payment recorded but confirmation failed');
                setProcessingOrder(false);
            }
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error('Payment successful but failed to record');
            setProcessingOrder(false);
        }
    };

    const handleRazorpayPayment = async () => {
        const created = await createOrder();
        if (!created) return;
        const { orderId, items: orderedItems } = created;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error('Failed to load Razorpay. Please try again.');
            setProcessingOrder(false);
            return;
        }

        const options = {
            key: 'rzp_test_Rn8Ex6HXTGRPIx', // Your Razorpay Test Key
            amount: Math.round(calculateTotal() * 100), // Amount in paise
            currency: 'INR',
            name: 'Shoe-Verse',
            description: `Order #${orderId}`,
            order_id: '',
            handler: function (response) {
                handlePaymentSuccess(response, orderId, orderedItems);
            },
            prefill: {
                name: user.username || user.name,
                email: user.email,
                contact: formData.phone
            },
            notes: {
                orderId: orderId,
                address: formData.address
            },
            theme: {
                color: '#6366f1'
            },
            modal: {
                ondismiss: function () {
                    setProcessingOrder(false);
                    toast.info('Payment cancelled');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handleCODPayment = async () => {
        const created = await createOrder();
        if (!created) return;
        const { orderId, items: orderedItems } = created;

        try {
            // Create COD payment record
            const paymentPayload = {
                orderId: orderId,
                paymentMethod: 'COD',
                transactionId: `COD_${orderId}_${Date.now()}`,
                amount: calculateTotal(),
                paymentStatus: 'Pending'
            };

            const response = await fetch('https://localhost:7208/api/Payment/CreatePayment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentPayload)
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Order placed successfully!');

                // dispatch productStockChanged so product pages refresh
                window.dispatchEvent(new CustomEvent('productStockChanged', { detail: { orderId, items: orderedItems } }));
                window.dispatchEvent(new Event('cartUpdated'));

                // Redirect to Thank You page with order details
                setTimeout(() => {
                    navigate('/order-success', {
                        state: {
                            orderDetails: {
                                orderId: orderId,
                                totalAmount: calculateTotal(),
                                paymentMethod: 'Cash on Delivery',
                                paymentStatus: 'Pending'
                            }
                        }
                    });
                }, 1000);
            } else {
                toast.error(result.message || 'Failed to place order');
                setProcessingOrder(false);
            }
        } catch (error) {
            console.error('Error placing COD order:', error);
            toast.error('Failed to place order');
            setProcessingOrder(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (formData.paymentMethod === 'razorpay') {
            await handleRazorpayPayment();
        } else {
            await handleCODPayment();
        }
    };

    const getImageUrl = (item) => {
        if (item.colorImageUrl) {
            return `https://localhost:7208${item.colorImageUrl}`;
        }
        if (item.color?.imageUrl) {
            return `https://localhost:7208${item.color.imageUrl}`;
        }
        return 'https://via.placeholder.com/80x80?text=No+Image';
    };

    const getProductName = (item) => {
        return item.productName || item.product?.name || 'Product';
    };

    const getPrice = (item) => {
        return item.unitPrice || item.product?.price || 0;
    };

    if (loading) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="checkout-container">
                <div className="container py-5">
                    {/* Header */}
                    <div className="checkout-header">
                        <button className="back-btn" onClick={() => navigate('/cart')}>
                            <BsArrowLeft size={20} />
                        </button>
                        <h2>Checkout</h2>
                    </div>

                    <div className="row">
                        {/* Checkout Form */}
                        <div className="col-lg-7">
                            <form onSubmit={handlePlaceOrder}>
                                {/* Delivery Information */}
                                <div className="checkout-section">
                                    <h4>Delivery Information</h4>

                                    <div className="form-group mb-3">
                                        <label htmlFor="phone">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Enter 10-digit mobile number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label htmlFor="address">Delivery Address *</label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            className="form-control"
                                            rows="4"
                                            placeholder="Enter your complete delivery address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="checkout-section">
                                    <h4>Payment Method</h4>

                                    <div className="payment-methods">
                                        <div
                                            className={`payment-option ${formData.paymentMethod === 'razorpay' ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                                        >
                                            <input
                                                type="radio"
                                                id="razorpay"
                                                name="paymentMethod"
                                                value="razorpay"
                                                checked={formData.paymentMethod === 'razorpay'}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="razorpay">
                                                <BsCreditCard2Front size={24} />
                                                <div>
                                                    <strong>Pay Online (Razorpay)</strong>
                                                    <p>Credit/Debit Card, UPI, Net Banking</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div
                                            className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                                        >
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="cod">
                                                <BsCash size={24} />
                                                <div>
                                                    <strong>Cash on Delivery</strong>
                                                    <p>Pay when you receive</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 mt-4"
                                    disabled={processingOrder}
                                >
                                    {processingOrder ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {formData.paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-5">
                            <div className="order-summary-checkout">
                                <h4>Order Summary</h4>

                                {/* Cart Items */}
                                <div className="checkout-items">
                                    {cartItems.map((item) => (
                                        <div key={item.cartItemId || `${item.productId}-${item.sizeId}-${item.colorId}`} className="checkout-item">
                                            <img
                                                src={getImageUrl(item)}
                                                alt={getProductName(item)}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                                }}
                                            />
                                            <div className="item-details">
                                                <h6>{getProductName(item)}</h6>
                                                <p>Qty: {item.quantity}</p>
                                            </div>
                                            <div className="item-price">
                                                ₹{(getPrice(item) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                {/* Price Breakdown */}
                                <div className="summary-row">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="text-success fw-bold">Free</span>
                                </div>

                                <div className="summary-row">
                                    <span>Tax (GST)</span>
                                    <span>₹0.00</span>
                                </div>

                                <hr />

                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>

                                {/* Security Badge */}
                                <div className="security-badge">
                                    <BsShieldCheck size={20} />
                                    <span>100% Secure Payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        /* your existing styles unchanged */
      `}</style>
        </Layout>
    );
};

export default Checkout;
