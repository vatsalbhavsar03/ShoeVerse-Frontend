// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { BsHeart, BsHeartFill, BsCart3, BsShare, BsStar, BsStarFill, BsChevronLeft, BsChevronRight, BsPencil, BsTrash } from 'react-icons/bs';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isWishlist, setIsWishlist] = useState(false);
//   const [wishlistLoading, setWishlistLoading] = useState(false);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [sizeStocks, setSizeStocks] = useState({});
//   const [loadingStock, setLoadingStock] = useState(false);

//   // Reviews state
//   const [reviews, setReviews] = useState([]);
//   const [reviewsLoading, setReviewsLoading] = useState(false);
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [editingReview, setEditingReview] = useState(null);
//   const [reviewFormData, setReviewFormData] = useState({
//     rating: 0,
//     reviewText: ''
//   });

//   // Do NOT default to a real user id. Use null if not logged in.
//   const userId = JSON.parse(localStorage.getItem('user'))?.userId ?? null;
//   const API_BASE_URL = 'https://localhost:7208/api';

//   useEffect(() => {
//     fetchProductDetails();
//     window.scrollTo(0, 0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   useEffect(() => {
//     if (product) {
//       fetchRelatedProducts();
//       checkWishlistStatus();
//       fetchReviews();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product]);

//   useEffect(() => {
//     if (selectedColor) {
//       fetchSizeStocks();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedColor]);

//   const fetchProductDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${API_BASE_URL}/Product/GetProductById/${id}`);
//       const data = await response.json();

//       if (data.success) {
//         setProduct(data.product);
//         if (data.product.productColors && data.product.productColors.length > 0) {
//           setSelectedColor(data.product.productColors[0]);
//         }
//       } else {
//         toast.error('Product not found', { position: "top-right", autoClose: 3000 });
//         navigate('/products');
//       }
//     } catch (error) {
//       toast.error('Failed to load product details', { position: "top-right", autoClose: 3000 });
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkWishlistStatus = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/wishlist/user/${userId ?? ''}`);
//       if (response.ok) {
//         const wishlistData = await response.json();
//         const isInWishlist = Array.isArray(wishlistData) && wishlistData.some(item => item.productId === parseInt(id));
//         setIsWishlist(isInWishlist);
//       } else {
//         // non-fatal: just assume not in wishlist
//         setIsWishlist(false);
//       }
//     } catch (error) {
//       console.error('Error checking wishlist:', error);
//       setIsWishlist(false);
//     }
//   };

//   const fetchSizeStocks = async () => {
//     if (!selectedColor || !selectedColor.productSizes) return;

//     setLoadingStock(true);
//     const stockData = {};

//     try {
//       for (const size of selectedColor.productSizes) {
//         stockData[size.sizeId] = {
//           stock: size.stock || 0,
//           isAvailable: size.isAvailable || false,
//           sizeName: size.sizeName
//         };
//       }
//       setSizeStocks(stockData);
//     } catch (error) {
//       console.error('Error fetching size stocks:', error);
//     } finally {
//       setLoadingStock(false);
//     }
//   };

//   const fetchRelatedProducts = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/Product/GetAllProducts`);
//       const data = await response.json();

//       if (data.success) {
//         const related = data.products
//           .filter(p => p.isActive && p.categoryId === product.categoryId && p.productId !== product.productId)
//           .slice(0, 4);
//         setRelatedProducts(related);
//       }
//     } catch (error) {
//       console.error('Error fetching related products:', error);
//     }
//   };

//   // Reviews functions
//   const fetchReviews = async () => {
//     try {
//       setReviewsLoading(true);
//       const response = await fetch(`${API_BASE_URL}/Review/GetReviewsByProductId/${id}`);
//       if (!response.ok) {
//         setReviews([]);
//         return;
//       }
//       const data = await response.json();
//       setReviews(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       setReviews([]);
//     } finally {
//       setReviewsLoading(false);
//     }
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       toast.error('Please login to submit a review');
//       return;
//     }

//     if (!reviewFormData.reviewText.trim()) {
//       toast.error('Please write a review');
//       return;
//     }

//     try {
//       if (editingReview) {
//         const response = await fetch(`${API_BASE_URL}/Review/UpdateReview/${editingReview.reviewId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             rating: reviewFormData.rating,
//             reviewText: reviewFormData.reviewText
//           })
//         });

//         if (response.ok) {
//           toast.success('Review updated successfully!');
//           setEditingReview(null);
//           setReviewFormData({ rating: 0, reviewText: '' });
//           setShowReviewForm(false);
//           await fetchReviews();
//         } else {
//           const contentType = response.headers.get('content-type');
//           if (contentType && contentType.includes('application/json')) {
//             const error = await response.json();
//             toast.error(error.message || 'Failed to update review');
//           } else {
//             const errorText = await response.text();
//             console.error('Server error:', errorText);
//             toast.error('Failed to update review');
//           }
//         }
//       } else {
//         const response = await fetch(`${API_BASE_URL}/Review/AddReview`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             userId: userId,
//             productId: parseInt(id),
//             rating: reviewFormData.rating,
//             reviewText: reviewFormData.reviewText
//           })
//         });

//         if (response.ok) {
//           toast.success('Review submitted successfully!');
//           setReviewFormData({ rating: 0, reviewText: '' });
//           setShowReviewForm(false);
//           await fetchReviews();
//         } else {
//           const contentType = response.headers.get('content-type');
//           if (contentType && contentType.includes('application/json')) {
//             const error = await response.json();
//             toast.error(error.message || 'Failed to submit review');
//           } else {
//             const errorText = await response.text();
//             console.error('Server error:', errorText);
//             toast.error('Failed to submit review');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       toast.error('An error occurred while submitting your review');
//     }
//   };

//   const handleEditReview = (review) => {
//     setEditingReview(review);
//     setReviewFormData({
//       rating: review.rating,
//       reviewText: review.reviewText
//     });
//     setShowReviewForm(true);
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!window.confirm('Are you sure you want to delete this review?')) {
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/Review/DeleteReview/${reviewId}`, {
//         method: 'DELETE'
//       });

//       if (response.ok) {
//         toast.success('Review deleted successfully!');
//         await fetchReviews(); // ensure UI refreshes after delete
//       } else {
//         // attempt to read error JSON
//         try {
//           const err = await response.json();
//           toast.error(err.message || 'Failed to delete review');
//         } catch {
//           toast.error('Failed to delete review');
//         }
//       }
//     } catch (error) {
//       console.error('Error deleting review:', error);
//       toast.error('An error occurred');
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingReview(null);
//     setReviewFormData({ rating: 0, reviewText: '' });
//     setShowReviewForm(false);
//   };

//   const renderStars = (rating, interactive = false, onRatingChange = null) => {
//     return (
//       <div className="d-flex">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span
//             key={star}
//             onClick={() => interactive && onRatingChange && onRatingChange(star)}
//             style={{ cursor: interactive ? 'pointer' : 'default' }}
//             className="me-1"
//           >
//             {star <= rating ? (
//               <BsStarFill className="text-warning" size={interactive ? 24 : 16} />
//             ) : (
//               <BsStar className="text-warning" size={interactive ? 24 : 16} />
//             )}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//     } catch {
//       return '';
//     }
//   };

//   // Keep all your other existing functions
//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//     setSelectedSize(null);
//     setQuantity(1);
//     setCurrentImageIndex(0);
//   };

//   const handleSizeChange = (size) => {
//     setSelectedSize(size);
//     setQuantity(1);
//   };

//   const getCurrentImages = () => {
//     if (!selectedColor || !selectedColor.productImages) return [];
//     return selectedColor.productImages;
//   };

//   const nextImage = () => {
//     const images = getCurrentImages();
//     if (images.length > 0) {
//       setCurrentImageIndex((prev) => (prev + 1) % images.length);
//     }
//   };

//   const prevImage = () => {
//     const images = getCurrentImages();
//     if (images.length > 0) {
//       setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
//     }
//   };

//   const getAvailableStock = () => {
//     if (!selectedSize) return 0;
//     const sizeStock = sizeStocks[selectedSize.sizeId];
//     return sizeStock ? sizeStock.stock : 0;
//   };

//   const handleAddToCart = async () => {
//     if (!selectedColor) {
//       toast.error('Please select a color');
//       return;
//     }

//     if (!selectedSize) {
//       toast.error('Please select a size');
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem('user'));
//     if (!user || !user.userId) {
//       toast.error('Please login to add items to cart');
//       navigate('/');
//       return;
//     }

//     const availableStock = getAvailableStock();
//     if (quantity > availableStock) {
//       toast.error(`Only ${availableStock} items available in stock`);
//       return;
//     }

//     try {
//       const cartData = {
//         userId: user.userId,
//         productId: product.productId,
//         colorId: selectedColor.colorId,
//         sizeId: selectedSize.sizeId,
//         quantity: quantity
//       };

//       const response = await fetch(`${API_BASE_URL}/Cart/add`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(cartData)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         toast.success('Added to cart successfully!', {
//           position: "top-right",
//           autoClose: 1500
//         });

//         window.dispatchEvent(new Event('cartUpdated'));

//         setTimeout(() => {
//           navigate('/user/cart');
//         }, 1500);

//       } else {
//         toast.error(result.message || 'Failed to add to cart');
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       toast.error('Failed to add to cart');
//     }
//   };

//   const toggleWishlist = async () => {
//     setWishlistLoading(true);

//     try {
//       if (isWishlist) {
//         const response = await fetch(
//           `${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${id}`,
//           { method: 'DELETE' }
//         );

//         if (response.ok) {
//           setIsWishlist(false);
//           toast.info('Removed from wishlist', {
//             position: "top-right",
//             autoClose: 2000
//           });
//           window.dispatchEvent(new Event('wishlistUpdated'));
//         } else {
//           throw new Error('Failed to remove from wishlist');
//         }
//       } else {
//         const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             userId: userId,
//             productId: parseInt(id)
//           })
//         });

//         if (response.ok) {
//           setIsWishlist(true);
//           toast.success('Added to wishlist', {
//             position: "top-right",
//             autoClose: 2000
//           });
//           window.dispatchEvent(new Event('wishlistUpdated'));
//         } else {
//           const error = await response.json().catch(() => null);
//           toast.error((error && error.message) || 'Failed to add to wishlist');
//         }
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setWishlistLoading(false);
//     }
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: product.description,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success('Link copied to clipboard!', { position: "top-right", autoClose: 2000 });
//     }
//   };

//   const getMainImage = (prod) => {
//     const mainImage = prod.productColors?.[0]?.productImages?.find(img => img.isMainImage) ||
//       prod.productColors?.[0]?.productImages?.[0];
//     return mainImage ? `${API_BASE_URL.replace('/api', '')}${mainImage.imageUrl}` : '/placeholder-image.jpg';
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//         <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="container text-center py-5">
//         <h3>Product not found</h3>
//         <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
//           Back to Products
//         </button>
//       </div>
//     );
//   }

//   const currentImages = getCurrentImages();
//   const currentPrice = selectedColor?.price || product.price;
//   const totalColorStock = selectedColor?.stock || 0;
//   const selectedSizeStock = getAvailableStock();

//   return (
//     <>
//       <ToastContainer />

//       {/* Breadcrumb */}
//       <div className="bg-light py-3 mb-4">
//         <div className="container">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item">
//                 <a href="/" className="text-decoration-none">Home</a>
//               </li>
//               <li className="breadcrumb-item">
//                 <a href="/products" className="text-decoration-none">Products</a>
//               </li>
//               <li className="breadcrumb-item">
//                 <span className="text-decoration-none">{product.category?.categoryName}</span>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="container mb-3">
//         <button
//           className="btn btn-outline-secondary"
//           onClick={() => navigate(-1)}
//         >
//           <BsChevronLeft className="me-2" />
//           Back
//         </button>
//       </div>

//       {/* Product Details */}
//       <div className="container mb-5">
//         <div className="row g-4">
//           {/* LEFT COLUMN - Image Gallery + Reviews */}
//           <div className="col-lg-6">
//             {/* Image Gallery */}
//             <div className="card shadow-sm border-0 mb-3">
//               <div className="card-body p-0">
//                 <div className="position-relative" style={{ height: '500px' }}>
//                   {currentImages.length > 0 ? (
//                     <>
//                       <img
//                         src={`${API_BASE_URL.replace('/api', '')}${currentImages[currentImageIndex].imageUrl}`}
//                         alt={product.name}
//                         className="w-100 h-100"
//                         style={{ objectFit: 'cover' }}
//                       />
//                       {currentImages.length > 1 && (
//                         <>
//                           <button
//                             className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
//                             style={{ width: '40px', height: '40px' }}
//                             onClick={prevImage}
//                           >
//                             <BsChevronLeft />
//                           </button>
//                           <button
//                             className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
//                             style={{ width: '40px', height: '40px' }}
//                             onClick={nextImage}
//                           >
//                             <BsChevronRight />
//                           </button>
//                         </>
//                       )}
//                       <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
//                         <span className="badge bg-dark bg-opacity-75 px-3 py-2">
//                           {currentImageIndex + 1} / {currentImages.length}
//                         </span>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="d-flex align-items-center justify-content-center h-100 bg-light">
//                       <p className="text-muted">No image available</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Thumbnail Images */}
//             {currentImages.length > 1 && (
//               <div className="d-flex gap-2 overflow-auto mb-4">
//                 {currentImages.map((img, index) => (
//                   <div
//                     key={index}
//                     className={`border rounded ${currentImageIndex === index ? 'border-primary border-3' : ''}`}
//                     style={{ minWidth: '100px', height: '100px', cursor: 'pointer' }}
//                     onClick={() => setCurrentImageIndex(index)}
//                   >
//                     <img
//                       src={`${API_BASE_URL.replace('/api', '')}${img.imageUrl}`}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-100 h-100 rounded"
//                       style={{ objectFit: 'cover' }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* REVIEWS SECTION - Below Product Images */}
//             <div className="card shadow-sm border-0">
//               <div className="card-header bg-white d-flex justify-content-between align-items-center">
//                 <h5 className="fw-bold mb-0">Customer Reviews ({reviews.length})</h5>
//                 {userId && !showReviewForm && (
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => setShowReviewForm(true)}
//                   >
//                     Write Review
//                   </button>
//                 )}
//               </div>

//               <div className="card-body">
//                 {/* Review Form */}
//                 {showReviewForm && (
//                   <div className="mb-4 p-3 bg-light rounded">
//                     <h6 className="fw-bold mb-3">
//                       {editingReview ? 'Edit Your Review' : 'Write Your Review'}
//                     </h6>
//                     <form onSubmit={handleSubmitReview}>
//                       <div className="mb-3">
//                         <label className="form-label fw-semibold">Rating</label>
//                         {renderStars(reviewFormData.rating, true, (rating) =>
//                           setReviewFormData({ ...reviewFormData, rating })
//                         )}
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label fw-semibold">Your Review</label>
//                         <textarea
//                           className="form-control"
//                           rows="3"
//                           placeholder="Share your thoughts..."
//                           value={reviewFormData.reviewText}
//                           onChange={(e) =>
//                             setReviewFormData({ ...reviewFormData, reviewText: e.target.value })
//                           }
//                           required
//                         />
//                       </div>

//                       <div className="d-flex gap-2">
//                         <button type="submit" className="btn btn-primary btn-sm">
//                           {editingReview ? 'Update' : 'Submit'}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-secondary btn-sm"
//                           onClick={handleCancelEdit}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 )}

//                 {/* Reviews List */}
//                 {reviewsLoading ? (
//                   <div className="text-center py-3">
//                     <div className="spinner-border spinner-border-sm text-primary" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </div>
//                 ) : reviews.length === 0 ? (
//                   <div className="text-center py-3 text-muted">
//                     <p className="mb-0">No reviews yet. Be the first to review!</p>
//                   </div>
//                 ) : (
//                   <div className="reviews-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
//                     {reviews.map((review) => (
//                       <div key={review.reviewId} className="border-bottom pb-3 mb-3">
//                         <div className="d-flex justify-content-between align-items-start mb-2">
//                           <div>
//                             <h6 className="fw-bold mb-1">{review.userName || 'Anonymous'}</h6>
//                             {renderStars(review.rating)}
//                           </div>
//                           <div className="d-flex align-items-center gap-2">
//                             <small className="text-muted">{formatDate(review.createdAt)}</small>
//                             {userId === review.userId && (
//                               <div className="btn-group btn-group-sm">
//                                 <button
//                                   className="btn btn-outline-primary btn-sm"
//                                   onClick={() => handleEditReview(review)}
//                                   title="Edit review"
//                                 >
//                                   <BsPencil size={12} />
//                                 </button>
//                                 <button
//                                   className="btn btn-outline-danger btn-sm"
//                                   onClick={() => handleDeleteReview(review.reviewId)}
//                                   title="Delete review"
//                                 >
//                                   <BsTrash size={12} />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <p className="mb-0 text-muted small">{review.reviewText}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - Product Info (keep your existing code) */}
//           <div className="col-lg-6">
//             <div className="mb-3">
//               <span className="badge bg-light text-dark me-2 mb-2">{product.category?.categoryName}</span>
//               <span className="badge bg-secondary mb-2">{product.brand?.brandName}</span>
//             </div>

//             <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

//             <div className="mb-3 d-flex align-items-center">
//               <div className="text-warning me-2">
//                 {[...Array(5)].map((_, i) => (
//                   i < Math.floor(product.averageRating || 4) ? <BsStarFill key={i} /> : <BsStar key={i} />
//                 ))}
//               </div>
//               <span className="text-muted">
//                 ({product.averageRating?.toFixed(1) || '4.0'}) {reviews.length} Reviews
//               </span>
//             </div>

//             <div className="mb-4">
//               <h2 className="text-primary fw-bold mb-2">₹{currentPrice.toFixed(2)}</h2>
//               {totalColorStock > 0 ? (
//                 <span className="badge bg-success">In Stock ({totalColorStock} total for this color)</span>
//               ) : (
//                 <span className="badge bg-danger">Out of Stock</span>
//               )}
//             </div>

//             <div className="mb-4">
//               <h5 className="fw-bold mb-2">Description</h5>
//               <p className="text-muted">{product.description}</p>
//             </div>

//             <div className="mb-4">
//               <div className="row g-3">
//                 <div className="col-6">
//                   <div className="border rounded p-3">
//                     <small className="text-muted d-block">Gender</small>
//                     <strong>{product.gender}</strong>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="border rounded p-3">
//                     <small className="text-muted d-block">Material</small>
//                     <strong>{product.material}</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Color Selection */}
//             {product.productColors && product.productColors.length > 0 && (
//               <div className="mb-4">
//                 <h6 className="fw-bold mb-3">
//                   Select Color: <span className="text-primary">{selectedColor?.colorName}</span>
//                 </h6>
//                 <div className="d-flex flex-wrap gap-2">
//                   {product.productColors.map((color) => (
//                     <button
//                       key={color.colorId}
//                       className={`btn border rounded-circle position-relative ${selectedColor?.colorId === color.colorId ? 'border-primary border-3' : ''}`}
//                       style={{
//                         width: '50px',
//                         height: '50px',
//                         backgroundColor: color.hexCode,
//                         padding: 0
//                       }}
//                       onClick={() => handleColorChange(color)}
//                       title={`${color.colorName} (${color.stock || 0} in stock)`}
//                     >
//                       {selectedColor?.colorId === color.colorId && (
//                         <span className="position-absolute top-50 start-50 translate-middle text-white" style={{ textShadow: '0 0 3px #000' }}>
//                           ✓
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">
//                 Select Size
//                 {selectedSize && (
//                   <span className="text-primary ms-2">
//                     (Size {selectedSize.sizeName}: {selectedSizeStock} in stock)
//                   </span>
//                 )}
//               </h6>
//               {loadingStock ? (
//                 <div className="spinner-border spinner-border-sm" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               ) : (
//                 <div className="d-flex flex-wrap gap-3">
//                   {selectedColor?.productSizes?.map((size) => {
//                     const sizeStock = sizeStocks[size.sizeId];
//                     const stock = sizeStock?.stock || 0;
//                     const isAvailable = sizeStock?.isAvailable && stock > 0;

//                     return (
//                       <div key={size.sizeId} className="text-center">
//                         <button
//                           className={`btn ${selectedSize?.sizeId === size.sizeId ? 'btn-primary' : isAvailable ? 'btn-outline-primary' : 'btn-outline-secondary'} mb-1`}
//                           style={{ minWidth: '60px' }}
//                           onClick={() => handleSizeChange(size)}
//                           disabled={!isAvailable}
//                         >
//                           {size.sizeName}
//                         </button>
//                         <small className={`d-block ${stock === 0 ? 'text-danger' : selectedSize?.sizeId === size.sizeId ? 'text-primary fw-bold' : 'text-muted'}`}>
//                           {isAvailable ? `${stock} left` : 'Out of stock'}
//                         </small>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Quantity */}
//             <div className="mb-4">
//               <h6 className="fw-bold mb-3">Quantity</h6>
//               <div className="input-group" style={{ maxWidth: '150px' }}>
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 >
//                   -
//                 </button>
//                 <input
//                   type="text"
//                   className="form-control text-center"
//                   value={quantity}
//                   readOnly
//                 />
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
//                   disabled={!selectedSize || quantity >= selectedSizeStock}
//                 >
//                   +
//                 </button>
//               </div>
//               {selectedSize && selectedSizeStock > 0 && (
//                 <small className="text-muted d-block mt-2">
//                   Maximum available: {selectedSizeStock}
//                 </small>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="d-grid gap-2 mb-3">
//               <button
//                 className="btn btn-primary btn-lg"
//                 onClick={handleAddToCart}
//                 disabled={!product.isActive || !selectedSize || selectedSizeStock === 0}
//               >
//                 <BsCart3 size={20} className="me-2" />
//                 {selectedSizeStock === 0 ? 'Out of Stock' : 'Add to Cart'}
//               </button>

//               <div className="row g-2">
//                 <div className="col-6">
//                   <button
//                     className="btn btn-outline-danger w-100"
//                     onClick={toggleWishlist}
//                     disabled={wishlistLoading}
//                   >
//                     {wishlistLoading ? (
//                       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                     ) : (
//                       isWishlist ? <BsHeartFill className="me-2" /> : <BsHeart className="me-2" />
//                     )}
//                     {isWishlist ? 'In Wishlist' : 'Add to Wishlist'}
//                   </button>
//                 </div>
//                 <div className="col-6">
//                   <button className="btn btn-outline-secondary w-100" onClick={handleShare}>
//                     <BsShare className="me-2" />
//                     Share
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <div className="card bg-light border-0">
//               <div className="card-body">
//                 <div className="d-flex align-items-start mb-2">
//                   <span className="me-2">✓</span>
//                   <small>7-day return policy</small>
//                 </div>
//                 <div className="d-flex align-items-start">
//                   <span className="me-2">✓</span>
//                   <small>Secure checkout with SSL encryption</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Product Specifications */}
//         <div className="row mt-5">
//           <div className="col-12">
//             <div className="card shadow-sm border-0">
//               <div className="card-header bg-white">
//                 <h5 className="fw-bold mb-0">Product Specifications</h5>
//               </div>
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <table className="table table-borderless">
//                       <tbody>
//                         <tr>
//                           <td className="text-muted">Brand</td>
//                           <td className="fw-semibold">{product.brand?.brandName}</td>
//                         </tr>
//                         <tr>
//                           <td className="text-muted">Category</td>
//                           <td className="fw-semibold">{product.category?.categoryName}</td>
//                         </tr>
//                         <tr>
//                           <td className="text-muted">Gender</td>
//                           <td className="fw-semibold">{product.gender}</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                   <div className="col-md-6">
//                     <table className="table table-borderless">
//                       <tbody>
//                         <tr>
//                           <td className="text-muted">Material</td>
//                           <td className="fw-semibold">{product.material}</td>
//                         </tr>
//                         <tr>
//                           <td className="text-muted">Available Colors</td>
//                           <td className="fw-semibold">{product.productColors?.length || 0}</td>
//                         </tr>
//                         <tr>
//                           <td className="text-muted">Stock Status</td>
//                           <td className="fw-semibold">
//                             {totalColorStock > 0 ? `${totalColorStock} In Stock` : 'Out of Stock'}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Related Products */}
//         {relatedProducts.length > 0 && (
//           <div className="row mt-5">
//             <div className="col-12 mb-4">
//               <h3 className="fw-bold">You May Also Like</h3>
//             </div>
//             {relatedProducts.map(relatedProduct => (
//               <div key={relatedProduct.productId} className="col-md-6 col-lg-3 mb-4">
//                 <div
//                   className="card h-100 shadow-sm border-0 product-card"
//                   onClick={() => navigate(`/product/${relatedProduct.productId}`)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   <img
//                     src={getMainImage(relatedProduct)}
//                     className="card-img-top"
//                     alt={relatedProduct.name}
//                     style={{ height: '200px', objectFit: 'cover' }}
//                   />
//                   <div className="card-body">
//                     <h6 className="card-title fw-bold">{relatedProduct.name}</h6>
//                     <p className="text-primary fw-bold mb-0">₹{relatedProduct.price.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <style>{`
//         .product-card {
//           transition: transform 0.3s ease;
//         }
//         .product-card:hover {
//           transform: translateY(-5px);
//         }
//         .reviews-list::-webkit-scrollbar {
//           width: 6px;
//         }
//         .reviews-list::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .reviews-list::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .reviews-list::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ProductDetail;













import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BsHeart, BsHeartFill, BsCart3, BsShare, BsStar, BsStarFill, BsChevronLeft, BsChevronRight, BsPencil, BsTrash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [sizeStocks, setSizeStocks] = useState({});
  const [loadingStock, setLoadingStock] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 0,
    reviewText: ''
  });

  // UI lock while refreshing stock after order
  const [uiLocked, setUiLocked] = useState(false);

  const userId = JSON.parse(localStorage.getItem('user'))?.userId ?? null;
  const API_BASE_URL = 'https://localhost:7208/api';

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
      checkWishlistStatus();
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if (selectedColor) {
      fetchSizeStocks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor]);

  // Listen for global events that indicate stock changed (order placed).
  useEffect(() => {
    const handleStockRefresh = (e) => {
      try {
        const detail = e?.detail;
        if (detail && detail.items && Array.isArray(detail.items)) {
          const productIds = detail.items.map(it => parseInt(it.productId, 10));
          // If the event doesn't include this product, skip refresh
          if (!productIds.includes(parseInt(id, 10))) {
            return;
          }
        }
      } catch (err) {
        // ignore parsing problems and proceed to refresh
      }

      setUiLocked(true);
      fetchProductDetails().finally(() => {
        setTimeout(() => setUiLocked(false), 600);
      });
    };

    window.addEventListener('productStockChanged', handleStockRefresh);
    window.addEventListener('cartUpdated', handleStockRefresh); // fallback

    return () => {
      window.removeEventListener('productStockChanged', handleStockRefresh);
      window.removeEventListener('cartUpdated', handleStockRefresh);
    };
  }, [id, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Product/GetProductById/${id}`);
      const data = await response.json();

      if (data && data.success) {
        setProduct(data.product);
        if (data.product.productColors && data.product.productColors.length > 0) {
          const firstColor = data.product.productColors[0];
          const stillExists = selectedColor && data.product.productColors.some(c => c.colorId === selectedColor.colorId);
          if (!stillExists) {
            setSelectedColor(firstColor);
            setSelectedSize(null);
            setQuantity(1);
            setCurrentImageIndex(0);
          } else {
            const colorObj = data.product.productColors.find(c => c.colorId === (selectedColor?.colorId ?? firstColor.colorId));
            if (selectedSize && colorObj && !colorObj.productSizes.some(s => s.sizeId === selectedSize.sizeId)) {
              setSelectedSize(null);
              setQuantity(1);
            }
          }
        } else {
          setSelectedColor(null);
          setSelectedSize(null);
        }
      } else {
        toast.error('Product not found', { position: "top-right", autoClose: 3000 });
        navigate('/products');
      }
    } catch (error) {
      toast.error('Failed to load product details', { position: "top-right", autoClose: 3000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/user/${userId ?? ''}`);
      if (response.ok) {
        const wishlistData = await response.json();
        const isInWishlist = Array.isArray(wishlistData) && wishlistData.some(item => item.productId === parseInt(id, 10));
        setIsWishlist(isInWishlist);
      } else {
        setIsWishlist(false);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
      setIsWishlist(false);
    }
  };

  const fetchSizeStocks = async () => {
    if (!selectedColor || !selectedColor.productSizes) return;

    setLoadingStock(true);
    const stockData = {};

    try {
      for (const size of selectedColor.productSizes) {
        stockData[size.sizeId] = {
          stock: size.stock || 0,
          isAvailable: size.isAvailable || false,
          sizeName: size.sizeName
        };
      }
      setSizeStocks(stockData);
    } catch (error) {
      console.error('Error fetching size stocks:', error);
    } finally {
      setLoadingStock(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Product/GetAllProducts`);
      const data = await response.json();

      if (data && data.success) {
        const related = data.products
          .filter(p => p.isActive && p.categoryId === product.categoryId && p.productId !== product.productId)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Reviews functions (unchanged)
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${API_BASE_URL}/Review/GetReviewsByProductId/${id}`);
      if (!response.ok) {
        setReviews([]);
        return;
      }
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!reviewFormData.reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      if (editingReview) {
        const response = await fetch(`${API_BASE_URL}/Review/UpdateReview/${editingReview.reviewId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rating: reviewFormData.rating,
            reviewText: reviewFormData.reviewText
          })
        });

        if (response.ok) {
          toast.success('Review updated successfully!');
          setEditingReview(null);
          setReviewFormData({ rating: 0, reviewText: '' });
          setShowReviewForm(false);
          await fetchReviews();
        } else {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            toast.error(error.message || 'Failed to update review');
          } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            toast.error('Failed to update review');
          }
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/Review/AddReview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            productId: parseInt(id, 10),
            rating: reviewFormData.rating,
            reviewText: reviewFormData.reviewText
          })
        });

        if (response.ok) {
          toast.success('Review submitted successfully!');
          setReviewFormData({ rating: 0, reviewText: '' });
          setShowReviewForm(false);
          await fetchReviews();
        } else {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            toast.error(error.message || 'Failed to submit review');
          } else {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            toast.error('Failed to submit review');
          }
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewFormData({
      rating: review.rating,
      reviewText: review.reviewText
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Review/DeleteReview/${reviewId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Review deleted successfully!');
        await fetchReviews();
      } else {
        try {
          const err = await response.json();
          toast.error(err.message || 'Failed to delete review');
        } catch {
          toast.error('Failed to delete review');
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('An error occurred');
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewFormData({ rating: 0, reviewText: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            className="me-1"
          >
            {star <= rating ? (
              <BsStarFill className="text-warning" size={interactive ? 24 : 16} />
            ) : (
              <BsStar className="text-warning" size={interactive ? 24 : 16} />
            )}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const handleColorChange = (color) => {
    if (uiLocked) return;
    setSelectedColor(color);
    setSelectedSize(null);
    setQuantity(1);
    setCurrentImageIndex(0);
  };

  const handleSizeChange = (size) => {
    if (uiLocked) return;
    setSelectedSize(size);
    setQuantity(1);
  };

  const getCurrentImages = () => {
    if (!selectedColor || !selectedColor.productImages) return [];
    return selectedColor.productImages;
  };

  const nextImage = () => {
    const images = getCurrentImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = getCurrentImages();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getAvailableStock = () => {
    if (!selectedSize) return 0;
    const sizeStock = sizeStocks[selectedSize.sizeId];
    return sizeStock ? sizeStock.stock : 0;
  };

  const handleAddToCart = async () => {
    if (uiLocked) return toast.info('Refreshing stock — please wait');

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) {
      toast.error('Please login to add items to cart');
      navigate('/');
      return;
    }

    const availableStock = getAvailableStock();
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    try {
      const cartData = {
        userId: user.userId,
        productId: product.productId,
        colorId: selectedColor.colorId,
        sizeId: selectedSize.sizeId,
        quantity: quantity
      };

      const response = await fetch(`${API_BASE_URL}/Cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cartData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Added to cart successfully!', {
          position: "top-right",
          autoClose: 1500
        });

        window.dispatchEvent(new Event('cartUpdated'));

        setTimeout(() => {
          navigate('/user/cart');
        }, 1500);

      } else {
        toast.error(result.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const toggleWishlist = async () => {
    if (uiLocked) return toast.info('Refreshing — please wait');

    setWishlistLoading(true);

    try {
      if (isWishlist) {
        const response = await fetch(
          `${API_BASE_URL}/wishlist/remove?userId=${userId}&productId=${id}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setIsWishlist(false);
          toast.info('Removed from wishlist', {
            position: "top-right",
            autoClose: 2000
          });
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            productId: parseInt(id, 10)
          })
        });

        if (response.ok) {
          setIsWishlist(true);
          toast.success('Added to wishlist', {
            position: "top-right",
            autoClose: 2000
          });
          window.dispatchEvent(new Event('wishlistUpdated'));
        } else {
          const error = await response.json().catch(() => null);
          toast.error((error && error.message) || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { position: "top-right", autoClose: 2000 });
    }
  };

  const getMainImage = (prod) => {
    const mainImage = prod.productColors?.[0]?.productImages?.find(img => img.isMainImage) ||
      prod.productColors?.[0]?.productImages?.[0];
    return mainImage ? `${API_BASE_URL.replace('/api', '')}${mainImage.imageUrl}` : '/placeholder-image.jpg';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container text-center py-5">
        <h3>Product not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const currentImages = getCurrentImages();
  const currentPrice = selectedColor?.price || product.price;
  const totalColorStock = selectedColor?.stock || 0;
  const selectedSizeStock = getAvailableStock();

  return (
    <>
      <ToastContainer />

      {/* Breadcrumb */}
      <div className="bg-light py-3 mb-4">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/products" className="text-decoration-none">Products</a>
              </li>
              <li className="breadcrumb-item">
                <span className="text-decoration-none">{product.category?.categoryName}</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
          disabled={uiLocked}
        >
          <BsChevronLeft className="me-2" />
          Back
        </button>
      </div>

      {/* Product Details */}
      <div className="container mb-5">
        <div className="row g-4">
          {/* LEFT COLUMN - Image Gallery + Reviews */}
          <div className="col-lg-6">
            {/* Image Gallery */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body p-0">
                <div className="position-relative" style={{ height: '500px' }}>
                  {currentImages.length > 0 ? (
                    <>
                      <img
                        src={`${API_BASE_URL.replace('/api', '')}${currentImages[currentImageIndex].imageUrl}`}
                        alt={product.name}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      {currentImages.length > 1 && (
                        <>
                          <button
                            className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                            onClick={prevImage}
                            disabled={uiLocked}
                          >
                            <BsChevronLeft />
                          </button>
                          <button
                            className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle"
                            style={{ width: '40px', height: '40px' }}
                            onClick={nextImage}
                            disabled={uiLocked}
                          >
                            <BsChevronRight />
                          </button>
                        </>
                      )}
                      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                        <span className="badge bg-dark bg-opacity-75 px-3 py-2">
                          {currentImageIndex + 1} / {currentImages.length}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <p className="text-muted">No image available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="d-flex gap-2 overflow-auto mb-4">
                {currentImages.map((img, index) => (
                  <div
                    key={index}
                    className={`border rounded ${currentImageIndex === index ? 'border-primary border-3' : ''}`}
                    style={{ minWidth: '100px', height: '100px', cursor: uiLocked ? 'not-allowed' : 'pointer' }}
                    onClick={() => !uiLocked && setCurrentImageIndex(index)}
                  >
                    <img
                      src={`${API_BASE_URL.replace('/api', '')}${img.imageUrl}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-100 h-100 rounded"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* REVIEWS SECTION */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Customer Reviews ({reviews.length})</h5>
                {userId && !showReviewForm && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowReviewForm(true)}
                    disabled={uiLocked}
                  >
                    Write Review
                  </button>
                )}
              </div>

              <div className="card-body">
                {showReviewForm && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="fw-bold mb-3">
                      {editingReview ? 'Edit Your Review' : 'Write Your Review'}
                    </h6>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Rating</label>
                        {renderStars(reviewFormData.rating, true, (rating) =>
                          setReviewFormData({ ...reviewFormData, rating })
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Your Review</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Share your thoughts..."
                          value={reviewFormData.reviewText}
                          onChange={(e) =>
                            setReviewFormData({ ...reviewFormData, reviewText: e.target.value })
                          }
                          required
                          disabled={uiLocked}
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary btn-sm" disabled={uiLocked}>
                          {editingReview ? 'Update' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleCancelEdit}
                          disabled={uiLocked}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-3 text-muted">
                    <p className="mb-0">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="reviews-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {reviews.map((review) => (
                      <div key={review.reviewId} className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold mb-1">{review.userName || 'Anonymous'}</h6>
                            {renderStars(review.rating)}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-muted">{formatDate(review.createdAt)}</small>
                            {userId === review.userId && (
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEditReview(review)}
                                  title="Edit review"
                                  disabled={uiLocked}
                                >
                                  <BsPencil size={12} />
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteReview(review.reviewId)}
                                  title="Delete review"
                                  disabled={uiLocked}
                                >
                                  <BsTrash size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="mb-0 text-muted small">{review.reviewText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-6">
            <div className="mb-3">
              <span className="badge bg-light text-dark me-2 mb-2">{product.category?.categoryName}</span>
              <span className="badge bg-secondary mb-2">{product.brand?.brandName}</span>
            </div>

            <h1 className="display-5 fw-bold mb-3">{product.name}</h1>

            <div className="mb-3 d-flex align-items-center">
              <div className="text-warning me-2">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.averageRating || 4) ? <BsStarFill key={i} /> : <BsStar key={i} />
                ))}
              </div>
              <span className="text-muted">
                ({product.averageRating?.toFixed(1) || '4.0'}) {reviews.length} Reviews
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-primary fw-bold mb-2">₹{currentPrice.toFixed(2)}</h2>
              {totalColorStock > 0 ? (
                <span className="badge bg-success">In Stock ({totalColorStock} total for this color)</span>
              ) : (
                <span className="badge bg-danger">Out of Stock</span>
              )}
            </div>

            <div className="mb-4">
              <h5 className="fw-bold mb-2">Description</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            <div className="mb-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">Gender</small>
                    <strong>{product.gender}</strong>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted d-block">Material</small>
                    <strong>{product.material}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            {product.productColors && product.productColors.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  Select Color: <span className="text-primary">{selectedColor?.colorName}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {product.productColors.map((color) => (
                    <button
                      key={color.colorId}
                      className={`btn border rounded-circle position-relative ${selectedColor?.colorId === color.colorId ? 'border-primary border-3' : ''}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: color.hexCode,
                        padding: 0,
                        cursor: uiLocked ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => !uiLocked && handleColorChange(color)}
                      title={`${color.colorName} (${color.stock || 0} in stock)`}
                      disabled={uiLocked}
                    >
                      {selectedColor?.colorId === color.colorId && (
                        <span className="position-absolute top-50 start-50 translate-middle text-white" style={{ textShadow: '0 0 3px #000' }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">
                Select Size
                {selectedSize && (
                  <span className="text-primary ms-2">
                    (Size {selectedSize.sizeName}: {selectedSizeStock} in stock)
                  </span>
                )}
              </h6>
              {loadingStock ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-3">
                  {selectedColor?.productSizes?.map((size) => {
                    const sizeStock = sizeStocks[size.sizeId];
                    const stock = sizeStock?.stock || 0;
                    const isAvailable = sizeStock?.isAvailable && stock > 0;

                    return (
                      <div key={size.sizeId} className="text-center">
                        <button
                          className={`btn ${selectedSize?.sizeId === size.sizeId ? 'btn-primary' : isAvailable ? 'btn-outline-primary' : 'btn-outline-secondary'} mb-1`}
                          style={{ minWidth: '60px' }}
                          onClick={() => !uiLocked && handleSizeChange(size)}
                          disabled={!isAvailable || uiLocked}
                        >
                          {size.sizeName}
                        </button>
                        <small className={`d-block ${stock === 0 ? 'text-danger' : selectedSize?.sizeId === size.sizeId ? 'text-primary fw-bold' : 'text-muted'}`}>
                          {isAvailable ? `${stock} left` : 'Out of stock'}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Quantity</h6>
              <div className="input-group" style={{ maxWidth: '150px' }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => !uiLocked && setQuantity(Math.max(1, quantity - 1))}
                  disabled={uiLocked || quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => !uiLocked && setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                  disabled={uiLocked || !selectedSize || quantity >= selectedSizeStock}
                >
                  +
                </button>
              </div>
              {selectedSize && selectedSizeStock > 0 && (
                <small className="text-muted d-block mt-2">
                  Maximum available: {selectedSizeStock}
                </small>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 mb-3">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={!product.isActive || !selectedSize || selectedSizeStock === 0 || uiLocked}
              >
                <BsCart3 size={20} className="me-2" />
                {selectedSizeStock === 0 ? 'Out of Stock' : uiLocked ? 'Refreshing...' : 'Add to Cart'}
              </button>

              <div className="row g-2">
                <div className="col-6">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={toggleWishlist}
                    disabled={wishlistLoading || uiLocked}
                  >
                    {wishlistLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      isWishlist ? <BsHeartFill className="me-2" /> : <BsHeart className="me-2" />
                    )}
                    {isWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-secondary w-100" onClick={handleShare} disabled={uiLocked}>
                    <BsShare className="me-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="card bg-light border-0">
              <div className="card-body">
                <div className="d-flex align-items-start mb-2">
                  <span className="me-2">✓</span>
                  <small>7-day return policy</small>
                </div>
                <div className="d-flex align-items-start">
                  <span className="me-2">✓</span>
                  <small>Secure checkout with SSL encryption</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications (unchanged) */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="fw-bold mb-0">Product Specifications</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Brand</td>
                          <td className="fw-semibold">{product.brand?.brandName}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Category</td>
                          <td className="fw-semibold">{product.category?.categoryName}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Gender</td>
                          <td className="fw-semibold">{product.gender}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">Material</td>
                          <td className="fw-semibold">{product.material}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Available Colors</td>
                          <td className="fw-semibold">{product.productColors?.length || 0}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Stock Status</td>
                          <td className="fw-semibold">
                            {totalColorStock > 0 ? `${totalColorStock} In Stock` : 'Out of Stock'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products (unchanged) */}
        {relatedProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12 mb-4">
              <h3 className="fw-bold">You May Also Like</h3>
            </div>
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.productId} className="col-md-6 col-lg-3 mb-4">
                <div
                  className="card h-100 shadow-sm border-0 product-card"
                  onClick={() => navigate(`/product/${relatedProduct.productId}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={getMainImage(relatedProduct)}
                    className="card-img-top"
                    alt={relatedProduct.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="card-title fw-bold">{relatedProduct.name}</h6>
                    <p className="text-primary fw-bold mb-0">₹{relatedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-card {
          transition: transform 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
        }
        .reviews-list::-webkit-scrollbar {
          width: 6px;
        }
        .reviews-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .reviews-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .reviews-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default ProductDetail;
