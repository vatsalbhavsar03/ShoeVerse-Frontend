// import React, { useState, useEffect } from 'react';
// import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsPencil, BsTrash, BsImage, BsX } from 'react-icons/bs';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ListProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [filteredBrands, setFilteredBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [validationError, setValidationError] = useState('');

//   // Form States
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     gender: '',
//     material: '',
//     categoryId: '',
//     brandId: '',
//     isActive: true
//   });

//   const [colors, setColors] = useState([
//     {
//       colorName: '',
//       hexCode: '#000000',
//       stock: '',
//       price: '',
//       images: []
//     }
//   ]);

//   const [editProductId, setEditProductId] = useState(null);
//   const [deleteProductId, setDeleteProductId] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//     fetchBrands();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');

//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }

//       const data = await response.json();

//       if (data.success) {
//         setProducts(data.products);
//       } else {
//         throw new Error(data.message || 'Failed to fetch products');
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch('https://localhost:7208/api/Categories/GetCategory');
//       const data = await response.json();
//       if (data.success) {
//         setCategories(data.category);
//       }
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   const fetchBrands = async () => {
//     try {
//       const response = await fetch('https://localhost:7208/api/Brands/GetBrands');
//       const data = await response.json();
//       if (data.success) {
//         setBrands(data.brand);
//       }
//     } catch (err) {
//       console.error('Error fetching brands:', err);
//     }
//   };

//   const handleCategoryChange = (categoryId) => {
//     setFormData({ ...formData, categoryId, brandId: '' });
//     const filtered = brands.filter(b => b.categoryId === parseInt(categoryId));
//     setFilteredBrands(filtered);
//     if (validationError) {
//       setValidationError('');
//     }
//   };

//   // Add Product Functions
//   const handleShowModal = () => {
//     setShowModal(true);
//     resetForm();
//     setValidationError('');
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     resetForm();
//     setValidationError('');
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       description: '',
//       price: '',
//       stock: '',
//       gender: '',
//       material: '',
//       categoryId: '',
//       brandId: '',
//       isActive: true
//     });
//     setColors([
//       {
//         colorName: '',
//         hexCode: '#000000',
//         stock: '',
//         price: '',
//         images: []
//       }
//     ]);
//     setFilteredBrands([]);
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       setValidationError('Product name is required');
//       return false;
//     }
//     if (formData.name.trim().length < 2) {
//       setValidationError('Product name must be at least 2 characters');
//       return false;
//     }
//     if (!formData.description.trim()) {
//       setValidationError('Description is required');
//       return false;
//     }
//     if (!formData.price || formData.price <= 0) {
//       setValidationError('Valid price is required');
//       return false;
//     }
//     if (!formData.stock || formData.stock < 0) {
//       setValidationError('Valid stock is required');
//       return false;
//     }
//     if (!formData.material.trim()) {
//       setValidationError('Material is required');
//       return false;
//     }
//     if (!formData.categoryId) {
//       setValidationError('Please select a category');
//       return false;
//     }
//     if (!formData.brandId) {
//       setValidationError('Please select a brand');
//       return false;
//     }
//     if (!formData.gender) {
//       setValidationError('Please select gender');
//       return false;
//     }
    
//     // Validate colors
//     for (let i = 0; i < colors.length; i++) {
//       if (!colors[i].colorName.trim()) {
//         setValidationError(`Color ${i + 1}: Color name is required`);
//         return false;
//       }
//       if (!colors[i].stock || colors[i].stock < 0) {
//         setValidationError(`Color ${i + 1}: Valid stock is required`);
//         return false;
//       }
//       if (colors[i].images.length === 0) {
//         setValidationError(`Color ${i + 1}: At least one image is required`);
//         return false;
//       }
//     }

//     setValidationError('');
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const formDataToSend = new FormData();
      
//       // Add basic product data
//       formDataToSend.append('Name', formData.name.trim());
//       formDataToSend.append('Description', formData.description.trim());
//       formDataToSend.append('Price', formData.price);
//       formDataToSend.append('Stock', formData.stock);
//       formDataToSend.append('Gender', formData.gender);
//       formDataToSend.append('Material', formData.material.trim());
//       formDataToSend.append('Category_ID', formData.categoryId);
//       formDataToSend.append('Brand_ID', formData.brandId);
//       formDataToSend.append('IsActive', formData.isActive);

//       // Add colors data
//       colors.forEach((color, colorIndex) => {
//         formDataToSend.append(`Colors[${colorIndex}].ColorName`, color.colorName);
//         formDataToSend.append(`Colors[${colorIndex}].HexCode`, color.hexCode);
//         formDataToSend.append(`Colors[${colorIndex}].Stock`, color.stock);
//         formDataToSend.append(`Colors[${colorIndex}].Price`, color.price || formData.price);

//         // Add images for this color
//         color.images.forEach((img, imgIndex) => {
//           if (img.file) {
//             formDataToSend.append('files', img.file);
//             formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.file.name);
//             formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].IsMainImage`, imgIndex === 0);
//           }
//         });
//       });

//       const response = await fetch('https://localhost:7208/api/Product/AddProduct', {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         toast.success(data.message || 'Product added successfully!', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         handleCloseModal();
//         fetchProducts();
//       } else {
//         toast.error(data.message || 'Failed to add product', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (err) {
//       toast.error('An error occurred while adding product', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Edit Product Functions
//   const handleShowEditModal = async (product) => {
//     setEditProductId(product.productId);
    
//     setFormData({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       stock: product.stock,
//       gender: product.gender,
//       material: product.material,
//       categoryId: product.categoryId,
//       brandId: product.brandId,
//       isActive: product.isActive
//     });

//     // Filter brands based on category
//     const filtered = brands.filter(b => b.categoryId === product.categoryId);
//     setFilteredBrands(filtered);

//     // Set colors with existing images
//     if (product.productColors && product.productColors.length > 0) {
//       const existingColors = product.productColors.map(color => ({
//         colorId: color.colorId,
//         colorName: color.colorName,
//         hexCode: color.hexCode,
//         stock: color.stock,
//         price: color.price,
//         images: color.productImages ? color.productImages.map(img => ({
//           imageId: img.imageId,
//           preview: `https://localhost:7208${img.imageUrl}`,
//           isMainImage: img.isMainImage,
//           existing: true
//         })) : []
//       }));
//       setColors(existingColors);
//     }

//     setShowEditModal(true);
//     setValidationError('');
//   };

//   const handleCloseEditModal = () => {
//     setShowEditModal(false);
//     setEditProductId(null);
//     resetForm();
//     setValidationError('');
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const formDataToSend = new FormData();
      
//       formDataToSend.append('Name', formData.name.trim());
//       formDataToSend.append('Description', formData.description.trim());
//       formDataToSend.append('Price', formData.price);
//       formDataToSend.append('Stock', formData.stock);
//       formDataToSend.append('Gender', formData.gender);
//       formDataToSend.append('Material', formData.material.trim());
//       formDataToSend.append('Category_ID', formData.categoryId);
//       formDataToSend.append('Brand_ID', formData.brandId);
//       formDataToSend.append('IsActive', formData.isActive);

//       colors.forEach((color, colorIndex) => {
//         if (color.colorId) {
//           formDataToSend.append(`Colors[${colorIndex}].Color_ID`, color.colorId);
//         }
//         formDataToSend.append(`Colors[${colorIndex}].ColorName`, color.colorName);
//         formDataToSend.append(`Colors[${colorIndex}].HexCode`, color.hexCode);
//         formDataToSend.append(`Colors[${colorIndex}].Stock`, color.stock);
//         formDataToSend.append(`Colors[${colorIndex}].Price`, color.price || formData.price);

//         color.images.forEach((img, imgIndex) => {
//           if (img.file) {
//             formDataToSend.append('files', img.file);
//             formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.file.name);
//           } else if (img.existing) {
//             formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].Image_ID`, img.imageId);
//             formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.preview);
//           }
//           formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].IsMainImage`, imgIndex === 0);
//         });
//       });

//       const response = await fetch(`https://localhost:7208/api/Product/UpdateProduct/${editProductId}`, {
//         method: 'PUT',
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         toast.success(data.message || 'Product updated successfully!', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         handleCloseEditModal();
//         fetchProducts();
//       } else {
//         toast.error(data.message || 'Failed to update product', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (err) {
//       toast.error('An error occurred while updating product', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Delete Product Functions
//   const handleShowDeleteModal = (productId) => {
//     setDeleteProductId(productId);
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeleteProductId(null);
//   };

//   const handleDeleteConfirm = async () => {
//     setSubmitting(true);

//     try {
//       const response = await fetch(`https://localhost:7208/api/Product/DeleteProduct/${deleteProductId}`, {
//         method: 'DELETE',
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         toast.success(data.message || 'Product deleted successfully!', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         handleCloseDeleteModal();
//         fetchProducts();
//       } else {
//         toast.error(data.message || 'Failed to delete product', {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (err) {
//       toast.error('An error occurred while deleting product', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Toggle Active Status
//   const handleToggleActive = async (productId, currentStatus) => {
//     try {
//       const response = await fetch(`https://localhost:7208/api/Product/ToggleActive/${productId}`, {
//         method: 'PATCH',
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         toast.success(`Product ${data.status ? 'activated' : 'deactivated'} successfully!`, {
//           position: "top-right",
//           autoClose: 2000,
//         });
//         fetchProducts();
//       }
//     } catch (err) {
//       toast.error('Failed to toggle product status', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Color Management Functions
//   const addColor = () => {
//     setColors([...colors, {
//       colorName: '',
//       hexCode: '#000000',
//       stock: '',
//       price: '',
//       images: []
//     }]);
//   };

//   const removeColor = (index) => {
//     if (colors.length > 1) {
//       const newColors = colors.filter((_, i) => i !== index);
//       setColors(newColors);
//     }
//   };

//   const updateColor = (index, field, value) => {
//     const newColors = [...colors];
//     newColors[index][field] = value;
//     setColors(newColors);
//     if (validationError) {
//       setValidationError('');
//     }
//   };

//   // Image Management Functions
//   const handleImageChange = (colorIndex, e) => {
//     const files = Array.from(e.target.files);
//     const newColors = [...colors];
    
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         newColors[colorIndex].images.push({
//           file: file,
//           preview: reader.result
//         });
//         setColors([...newColors]);
//       };
//       reader.readAsDataURL(file);
//     });

//     if (validationError) {
//       setValidationError('');
//     }
//   };

//   const removeImage = (colorIndex, imageIndex) => {
//     const newColors = [...colors];
//     newColors[colorIndex].images.splice(imageIndex, 1);
//     setColors(newColors);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//     if (validationError) {
//       setValidationError('');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center min-vh-50">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger d-flex align-items-center" role="alert">
//         <BsExclamationTriangleFill className="me-2" />
//         <div>
//           <strong>Error:</strong> {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer />
      
//       <div className="container">
//         <div className="row mb-4">
//           <div className="col-12">
//             <div className="d-flex justify-content-between align-items-center">
//               <div>
//                 <h2 className="fw-bold mb-1">Products</h2>
//                 <p className="text-muted mb-0">Manage all product inventory</p>
//               </div>
//               <button 
//                 className="btn btn-primary d-flex align-items-center gap-2"
//                 onClick={handleShowModal}
//                 style={{ width: 'auto', whiteSpace: 'nowrap' }}
//               >
//                 <BsPlusCircle />
//                 <span>Add Product</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-12">
//             <div className="card shadow-sm border-0">
//               <div className="card-header bg-white py-3 border-bottom">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0 fw-semibold">All Products</h5>
//                   <span className="badge bg-primary rounded-pill">{products.length}</span>
//                 </div>
//               </div>
//               <div className="card-body p-4">
//                 {products.length === 0 ? (
//                   <div className="text-center py-5">
//                     <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
//                     <h5 className="text-muted mt-3">No products found</h5>
//                     <p className="text-muted">Start by adding your first product</p>
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-hover table-bordered mb-0">
//                       <thead className="table-light">
//                         <tr>
//                           <th scope="col" className="px-4 py-3">#</th>
//                           <th scope="col" className="py-3">Image</th>
//                           <th scope="col" className="py-3">Name</th>
//                           <th scope="col" className="py-3">Category</th>
//                           <th scope="col" className="py-3">Brand</th>
//                           <th scope="col" className="py-3">Price</th>
//                           <th scope="col" className="py-3">Stock</th>
//                           <th scope="col" className="py-3">Status</th>
//                           <th scope="col" className="py-3 text-end px-4">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {products.map((product, index) => {
//                           const mainImage = product.productColors?.[0]?.productImages?.find(img => img.isMainImage) || 
//                                            product.productColors?.[0]?.productImages?.[0];
                          
//                           return (
//                             <tr key={product.productId}>
//                               <td className="px-4 py-3 text-muted">{index + 1}</td>
//                               <td className="py-3">
//                                 {mainImage ? (
//                                   <img 
//                                     src={`https://localhost:7208${mainImage.imageUrl}`} 
//                                     alt={product.name}
//                                     style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
//                                   />
//                                 ) : (
//                                   <BsImage style={{ fontSize: '50px', color: '#ccc' }} />
//                                 )}
//                               </td>
//                               <td className="py-3">
//                                 <span className="fw-medium">{product.name}</span>
//                               </td>
//                               <td className="py-3">
//                                 <span className="badge bg-info text-dark">{product.category?.categoryName}</span>
//                               </td>
//                               <td className="py-3">
//                                 <span className="badge bg-secondary">{product.brand?.brandName}</span>
//                               </td>
//                               <td className="py-3">${product.price}</td>
//                               <td className="py-3">{product.stock}</td>
//                               <td className="py-3">
//                                 <div className="form-check form-switch">
//                                   <input
//                                     className="form-check-input"
//                                     type="checkbox"
//                                     checked={product.isActive}
//                                     onChange={() => handleToggleActive(product.productId, product.isActive)}
//                                     style={{ cursor: 'pointer' }}
//                                   />
//                                 </div>
//                               </td>
//                               <td className="py-3 text-end px-4">
//                                 <div className="btn-group btn-group-sm" role="group">
//                                   <button 
//                                     className="btn btn-outline-primary me-2"
//                                     title="Edit"
//                                     onClick={() => handleShowEditModal(product)}
//                                   >
//                                     <BsPencil className="me-1" />
//                                     Edit
//                                   </button>
//                                   <button 
//                                     className="btn btn-outline-danger"
//                                     title="Delete"
//                                     onClick={() => handleShowDeleteModal(product.productId)}
//                                   >
//                                     <BsTrash className="me-1" />
//                                     Delete
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Product Modal */}
//       {(showModal || showEditModal) && (
//         <>
//           <div 
//             className="modal-backdrop fade show" 
//             style={{ zIndex: 1040 }}
//             onClick={showModal ? handleCloseModal : handleCloseEditModal}
//           ></div>
          
//           <div 
//             className="modal fade show d-block" 
//             tabIndex="-1" 
//             style={{ zIndex: 1050 }}
//             onClick={showModal ? handleCloseModal : handleCloseEditModal}
//           >
//             <div 
//               className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">{showModal ? 'Add New Product' : 'Edit Product'}</h5>
//                   <button 
//                     type="button" 
//                     className="btn-close" 
//                     onClick={showModal ? handleCloseModal : handleCloseEditModal}
//                     disabled={submitting}
//                   ></button>
//                 </div>
//                 <form onSubmit={showModal ? handleSubmit : handleEditSubmit}>
//                   <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                     {/* Basic Product Information */}
//                     <h6 className="fw-bold mb-3">Basic Information</h6>
//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="productName" className="form-label">
//                           Product Name <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="productName"
//                           placeholder="Enter product name"
//                           value={formData.name}
//                           onChange={(e) => handleInputChange('name', e.target.value)}
//                           disabled={submitting}
//                         />
//                       </div>
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="material" className="form-label">
//                           Material <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           id="material"
//                           placeholder="e.g., Leather, Canvas, Mesh"
//                           value={formData.material}
//                           onChange={(e) => handleInputChange('material', e.target.value)}
//                           disabled={submitting}
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label htmlFor="description" className="form-label">
//                         Description <span className="text-danger">*</span>
//                       </label>
//                       <textarea
//                         className="form-control"
//                         id="description"
//                         rows="3"
//                         placeholder="Enter product description"
//                         value={formData.description}
//                         onChange={(e) => handleInputChange('description', e.target.value)}
//                         disabled={submitting}
//                       />
//                     </div>

//                     <div className="row">
//                       <div className="col-md-4 mb-3">
//                         <label htmlFor="price" className="form-label">
//                           Price ($) <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           step="0.01"
//                           className="form-control"
//                           id="price"
//                           placeholder="0.00"
//                           value={formData.price}
//                           onChange={(e) => handleInputChange('price', e.target.value)}
//                           disabled={submitting}
//                         />
//                       </div>
//                       <div className="col-md-4 mb-3">
//                         <label htmlFor="stock" className="form-label">
//                           Stock <span className="text-danger">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           id="stock"
//                           placeholder="0"
//                           value={formData.stock}
//                           onChange={(e) => handleInputChange('stock', e.target.value)}
//                           disabled={submitting}
//                         />
//                       </div>
//                       <div className="col-md-4 mb-3">
//                         <label htmlFor="gender" className="form-label">
//                           Gender <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           id="gender"
//                           value={formData.gender}
//                           onChange={(e) => handleInputChange('gender', e.target.value)}
//                           disabled={submitting}
//                         >
//                           <option value="">Select Gender</option>
//                           <option value="Men">Men</option>
//                           <option value="Women">Women</option>
//                           <option value="Unisex">Unisex</option>
//                           <option value="Kids">Kids</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="categoryId" className="form-label">
//                           Category <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           id="categoryId"
//                           value={formData.categoryId}
//                           onChange={(e) => handleCategoryChange(e.target.value)}
//                           disabled={submitting}
//                         >
//                           <option value="">Select Category</option>
//                           {categories.map((category) => (
//                             <option key={category.categoryId} value={category.categoryId}>
//                               {category.categoryName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div className="col-md-6 mb-3">
//                         <label htmlFor="brandId" className="form-label">
//                           Brand <span className="text-danger">*</span>
//                         </label>
//                         <select
//                           className="form-select"
//                           id="brandId"
//                           value={formData.brandId}
//                           onChange={(e) => handleInputChange('brandId', e.target.value)}
//                           disabled={submitting || !formData.categoryId}
//                         >
//                           <option value="">Select Brand</option>
//                           {filteredBrands.map((brand) => (
//                             <option key={brand.brandId} value={brand.brandId}>
//                               {brand.brandName}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="form-check mb-4">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="isActive"
//                         checked={formData.isActive}
//                         onChange={(e) => handleInputChange('isActive', e.target.checked)}
//                         disabled={submitting}
//                       />
//                       <label className="form-check-label" htmlFor="isActive">
//                         Active Product
//                       </label>
//                     </div>

//                     <hr />

//                     {/* Colors and Images Section */}
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <h6 className="fw-bold mb-0">Color Variants</h6>
//                       <button 
//                         type="button" 
//                         className="btn btn-sm btn-outline-primary"
//                         onClick={addColor}
//                         disabled={submitting}
//                       >
//                         <BsPlusCircle className="me-1" />
//                         Add Color
//                       </button>
//                     </div>

//                     {colors.map((color, colorIndex) => (
//                       <div key={colorIndex} className="card mb-3">
//                         <div className="card-body">
//                           <div className="d-flex justify-content-between align-items-center mb-3">
//                             <h6 className="mb-0">Color Variant {colorIndex + 1}</h6>
//                             {colors.length > 1 && (
//                               <button 
//                                 type="button" 
//                                 className="btn btn-sm btn-outline-danger"
//                                 onClick={() => removeColor(colorIndex)}
//                                 disabled={submitting}
//                               >
//                                 <BsTrash className="me-1" />
//                                 Remove
//                               </button>
//                             )}
//                           </div>

//                           <div className="row">
//                             <div className="col-md-4 mb-3">
//                               <label className="form-label">
//                                 Color Name <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="text"
//                                 className="form-control"
//                                 placeholder="e.g., Red, Blue, Black"
//                                 value={color.colorName}
//                                 onChange={(e) => updateColor(colorIndex, 'colorName', e.target.value)}
//                                 disabled={submitting}
//                               />
//                             </div>
//                             <div className="col-md-2 mb-3">
//                               <label className="form-label">
//                                 Hex Code <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="color"
//                                 className="form-control form-control-color w-100"
//                                 value={color.hexCode}
//                                 onChange={(e) => updateColor(colorIndex, 'hexCode', e.target.value)}
//                                 disabled={submitting}
//                                 style={{ height: '38px' }}
//                               />
//                             </div>
//                             <div className="col-md-3 mb-3">
//                               <label className="form-label">
//                                 Stock <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 className="form-control"
//                                 placeholder="0"
//                                 value={color.stock}
//                                 onChange={(e) => updateColor(colorIndex, 'stock', e.target.value)}
//                                 disabled={submitting}
//                               />
//                             </div>
//                             <div className="col-md-3 mb-3">
//                               <label className="form-label">
//                                 Price (Optional)
//                               </label>
//                               <input
//                                 type="number"
//                                 step="0.01"
//                                 className="form-control"
//                                 placeholder="Default price"
//                                 value={color.price}
//                                 onChange={(e) => updateColor(colorIndex, 'price', e.target.value)}
//                                 disabled={submitting}
//                               />
//                             </div>
//                           </div>

//                           {/* Image Upload */}
//                           <div className="mb-3">
//                             <label className="form-label">
//                               Images <span className="text-danger">*</span>
//                             </label>
//                             <input
//                               type="file"
//                               className="form-control"
//                               multiple
//                               accept="image/*"
//                               onChange={(e) => handleImageChange(colorIndex, e)}
//                               disabled={submitting}
//                             />
//                             <small className="text-muted">First image will be the main display image</small>
//                           </div>

//                           {/* Image Preview */}
//                           {color.images.length > 0 && (
//                             <div className="d-flex flex-wrap gap-2 mt-2">
//                               {color.images.map((img, imgIndex) => (
//                                 <div key={imgIndex} className="position-relative" style={{ width: '100px', height: '100px' }}>
//                                   <img 
//                                     src={img.preview} 
//                                     alt={`Preview ${imgIndex}`}
//                                     className="img-thumbnail"
//                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                                   />
//                                   <button
//                                     type="button"
//                                     className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
//                                     style={{ padding: '2px 6px', lineHeight: 1 }}
//                                     onClick={() => removeImage(colorIndex, imgIndex)}
//                                     disabled={submitting}
//                                   >
//                                     <BsX size={16} />
//                                   </button>
//                                   {imgIndex === 0 && (
//                                     <span className="badge bg-primary position-absolute bottom-0 start-0 m-1" style={{ fontSize: '9px' }}>
//                                       Main
//                                     </span>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}

//                     {validationError && (
//                       <div className="alert alert-danger" role="alert">
//                         {validationError}
//                       </div>
//                     )}
//                   </div>
//                   <div className="modal-footer d-flex justify-content-end gap-2">
//                     <button 
//                       type="submit" 
//                       className="btn btn-primary"
//                       disabled={submitting}
//                       style={{ minWidth: '120px', flex: '0 0 auto' }}
//                     >
//                       {submitting ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2"></span>
//                           {showModal ? 'Adding...' : 'Updating...'}
//                         </>
//                       ) : (
//                         showModal ? 'Add Product' : 'Update Product'
//                       )}
//                     </button>
//                     <button 
//                       type="button" 
//                       className="btn btn-secondary" 
//                       onClick={showModal ? handleCloseModal : handleCloseEditModal}
//                       disabled={submitting}
//                       style={{ minWidth: '120px', flex: '0 0 auto' }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <>
//           <div 
//             className="modal-backdrop fade show" 
//             style={{ zIndex: 1040 }}
//             onClick={handleCloseDeleteModal}
//           ></div>
          
//           <div 
//             className="modal fade show d-block" 
//             tabIndex="-1" 
//             style={{ zIndex: 1050 }}
//             onClick={handleCloseDeleteModal}
//           >
//             <div 
//               className="modal-dialog modal-dialog-centered"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="modal-content">
//                 <div className="modal-header bg-danger text-white">
//                   <h5 className="modal-title">
//                     <BsExclamationTriangleFill className="me-2" />
//                     Confirm Delete
//                   </h5>
//                   <button 
//                     type="button" 
//                     className="btn-close btn-close-white" 
//                     onClick={handleCloseDeleteModal}
//                     disabled={submitting}
//                   ></button>
//                 </div>
//                 <div className="modal-body">
//                   <p className="mb-0">Are you sure you want to delete this product?</p>
//                   <p className="text-muted mb-0 mt-2">This will also delete all associated colors and images. This action cannot be undone.</p>
//                 </div>
//                 <div className="modal-footer d-flex justify-content-end gap-2">
//                   <button 
//                     type="button" 
//                     className="btn btn-danger"
//                     onClick={handleDeleteConfirm}
//                     disabled={submitting}
//                     style={{ minWidth: '120px', flex: '0 0 auto' }}
//                   >
//                     {submitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2"></span>
//                         Deleting...
//                       </>
//                     ) : (
//                       <>
//                         <BsTrash className="me-1" />
//                         Delete
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default ListProduct;

import React, { useState, useEffect } from 'react';
import { BsPlusCircle, BsExclamationTriangleFill, BsFolderX, BsPencil, BsTrash, BsImage, BsX } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    gender: '',
    material: '',
    categoryId: '',
    brandId: '',
    isActive: true
  });

  const [colors, setColors] = useState([
    {
      colorName: '',
      hexCode: '#000000',
      stock: '',
      price: '',
      images: []
    }
  ]);

  const [editProductId, setEditProductId] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Auto-calculate total stock from all color variants
  useEffect(() => {
    const totalStock = colors.reduce((sum, color) => {
      const stock = parseInt(color.stock) || 0;
      return sum + stock;
    }, 0);
    
    setFormData(prev => ({ ...prev, stock: totalStock }));
  }, [colors]);

  // Color name to hex mapping - Common colors
  const colorNameToHex = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#FF0000',
    'green': '#008000',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'teal': '#008080',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'maroon': '#800000',
    'olive': '#808000',
    'silver': '#C0C0C0',
    'gold': '#FFD700',
    'cyan': '#00FFFF',
    'magenta': '#FF00FF',
    'beige': '#F5F5DC',
    'turquoise': '#40E0D0',
    'violet': '#EE82EE',
    'indigo': '#4B0082',
    'coral': '#FF7F50',
    'salmon': '#FA8072',
    'khaki': '#F0E68C',
    'lavender': '#E6E6FA',
    'mint': '#98FF98',
    'peach': '#FFDAB9',
    'cream': '#FFFDD0',
    'ivory': '#FFFFF0',
    'tan': '#D2B48C',
    'burgundy': '#800020',
    'crimson': '#DC143C',
    'rose': '#FF007F',
    'sky blue': '#87CEEB',
    'forest green': '#228B22',
    'royal blue': '#4169E1',
    'dark blue': '#00008B',
    'light blue': '#ADD8E6',
    'dark green': '#006400',
    'light green': '#90EE90',
    'dark red': '#8B0000',
    'light pink': '#FFB6C1',
    'dark purple': '#301934',
    'light yellow': '#FFFFE0',
    'dark orange': '#FF8C00',
    'light gray': '#D3D3D3',
    'dark gray': '#A9A9A9',
    'charcoal': '#36454F'
  };

  // Hex to color name mapping
  const hexToColorName = (hex) => {
    hex = hex.toUpperCase();
    
    const colorMap = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#FF0000': 'Red',
      '#008000': 'Green',
      '#0000FF': 'Blue',
      '#FFFF00': 'Yellow',
      '#FFA500': 'Orange',
      '#800080': 'Purple',
      '#FFC0CB': 'Pink',
      '#A52A2A': 'Brown',
      '#808080': 'Gray',
      '#000080': 'Navy',
      '#008080': 'Teal',
      '#00FF00': 'Lime',
      '#00FFFF': 'Aqua',
      '#800000': 'Maroon',
      '#808000': 'Olive',
      '#C0C0C0': 'Silver',
      '#FFD700': 'Gold',
      '#FF00FF': 'Magenta',
      '#F5F5DC': 'Beige',
      '#40E0D0': 'Turquoise',
      '#EE82EE': 'Violet',
      '#4B0082': 'Indigo',
      '#FF7F50': 'Coral',
      '#FA8072': 'Salmon',
      '#F0E68C': 'Khaki',
      '#E6E6FA': 'Lavender',
      '#98FF98': 'Mint',
      '#FFDAB9': 'Peach',
      '#FFFDD0': 'Cream',
      '#FFFFF0': 'Ivory',
      '#D2B48C': 'Tan',
      '#800020': 'Burgundy',
      '#DC143C': 'Crimson',
      '#FF007F': 'Rose',
      '#87CEEB': 'Sky Blue',
      '#228B22': 'Forest Green',
      '#4169E1': 'Royal Blue',
      '#00008B': 'Dark Blue',
      '#ADD8E6': 'Light Blue',
      '#006400': 'Dark Green',
      '#90EE90': 'Light Green',
      '#8B0000': 'Dark Red',
      '#FFB6C1': 'Light Pink',
      '#301934': 'Dark Purple',
      '#FFFFE0': 'Light Yellow',
      '#FF8C00': 'Dark Orange',
      '#D3D3D3': 'Light Gray',
      '#A9A9A9': 'Dark Gray',
      '#36454F': 'Charcoal'
    };

    if (colorMap[hex]) {
      return colorMap[hex];
    }

    let closestColor = '';
    let minDistance = Infinity;

    const hexToRgb = (h) => {
      const r = parseInt(h.slice(1, 3), 16);
      const g = parseInt(h.slice(3, 5), 16);
      const b = parseInt(h.slice(5, 7), 16);
      return { r, g, b };
    };

    const currentRgb = hexToRgb(hex);

    for (const [colorHex, colorName] of Object.entries(colorMap)) {
      const rgb = hexToRgb(colorHex);
      const distance = Math.sqrt(
        Math.pow(currentRgb.r - rgb.r, 2) +
        Math.pow(currentRgb.g - rgb.g, 2) +
        Math.pow(currentRgb.b - rgb.b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = colorName;
      }
    }

    return closestColor || 'Custom Color';
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://localhost:7208/api/Product/GetAllProducts');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Categories/GetCategory');
      const data = await response.json();
      if (data.success) {
        setCategories(data.category);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('https://localhost:7208/api/Brands/GetBrands');
      const data = await response.json();
      if (data.success) {
        setBrands(data.brand);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData({ ...formData, categoryId, brandId: '' });
    const filtered = brands.filter(b => b.categoryId === parseInt(categoryId));
    setFilteredBrands(filtered);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    resetForm();
    setValidationError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
    setValidationError('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      gender: '',
      material: '',
      categoryId: '',
      brandId: '',
      isActive: true
    });
    setColors([
      {
        colorName: '',
        hexCode: '#000000',
        stock: '',
        price: '',
        images: []
      }
    ]);
    setFilteredBrands([]);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Product name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setValidationError('Product name must be at least 2 characters');
      return false;
    }
    if (!formData.description.trim()) {
      setValidationError('Description is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setValidationError('Valid price is required');
      return false;
    }
    if (!formData.material.trim()) {
      setValidationError('Material is required');
      return false;
    }
    if (!formData.categoryId) {
      setValidationError('Please select a category');
      return false;
    }
    if (!formData.brandId) {
      setValidationError('Please select a brand');
      return false;
    }
    if (!formData.gender) {
      setValidationError('Please select gender');
      return false;
    }
    
    for (let i = 0; i < colors.length; i++) {
      if (!colors[i].colorName.trim()) {
        setValidationError(`Color ${i + 1}: Color name is required`);
        return false;
      }
      if (!colors[i].stock || colors[i].stock < 0) {
        setValidationError(`Color ${i + 1}: Valid stock is required`);
        return false;
      }
      if (colors[i].images.length === 0) {
        setValidationError(`Color ${i + 1}: At least one image is required`);
        return false;
      }
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('Name', formData.name.trim());
      formDataToSend.append('Description', formData.description.trim());
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Stock', formData.stock);
      formDataToSend.append('Gender', formData.gender);
      formDataToSend.append('Material', formData.material.trim());
      formDataToSend.append('Category_ID', formData.categoryId);
      formDataToSend.append('Brand_ID', formData.brandId);
      formDataToSend.append('IsActive', formData.isActive);

      colors.forEach((color, colorIndex) => {
        formDataToSend.append(`Colors[${colorIndex}].ColorName`, color.colorName);
        formDataToSend.append(`Colors[${colorIndex}].HexCode`, color.hexCode);
        formDataToSend.append(`Colors[${colorIndex}].Stock`, color.stock);
        formDataToSend.append(`Colors[${colorIndex}].Price`, color.price || formData.price);

        color.images.forEach((img, imgIndex) => {
          if (img.file) {
            formDataToSend.append('files', img.file);
            formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.file.name);
            formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].IsMainImage`, imgIndex === 0);
          }
        });
      });

      const response = await fetch('https://localhost:7208/api/Product/AddProduct', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Product added successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseModal();
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to add product', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while adding product', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowEditModal = async (product) => {
    setEditProductId(product.productId);
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      gender: product.gender,
      material: product.material,
      categoryId: product.categoryId,
      brandId: product.brandId,
      isActive: product.isActive
    });

    const filtered = brands.filter(b => b.categoryId === product.categoryId);
    setFilteredBrands(filtered);

    if (product.productColors && product.productColors.length > 0) {
      const existingColors = product.productColors.map(color => ({
        colorId: color.colorId,
        colorName: color.colorName,
        hexCode: color.hexCode,
        stock: color.stock,
        price: color.price,
        images: color.productImages ? color.productImages.map(img => ({
          imageId: img.imageId,
          preview: `https://localhost:7208${img.imageUrl}`,
          isMainImage: img.isMainImage,
          existing: true
        })) : []
      }));
      setColors(existingColors);
    }

    setShowEditModal(true);
    setValidationError('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProductId(null);
    resetForm();
    setValidationError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('Name', formData.name.trim());
      formDataToSend.append('Description', formData.description.trim());
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Stock', formData.stock);
      formDataToSend.append('Gender', formData.gender);
      formDataToSend.append('Material', formData.material.trim());
      formDataToSend.append('Category_ID', formData.categoryId);
      formDataToSend.append('Brand_ID', formData.brandId);
      formDataToSend.append('IsActive', formData.isActive);

      colors.forEach((color, colorIndex) => {
        if (color.colorId) {
          formDataToSend.append(`Colors[${colorIndex}].Color_ID`, color.colorId);
        }
        formDataToSend.append(`Colors[${colorIndex}].ColorName`, color.colorName);
        formDataToSend.append(`Colors[${colorIndex}].HexCode`, color.hexCode);
        formDataToSend.append(`Colors[${colorIndex}].Stock`, color.stock);
        formDataToSend.append(`Colors[${colorIndex}].Price`, color.price || formData.price);

        color.images.forEach((img, imgIndex) => {
          if (img.file) {
            formDataToSend.append('files', img.file);
            formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.file.name);
          } else if (img.existing) {
            formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].Image_ID`, img.imageId);
            formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].ImageUrl`, img.preview);
          }
          formDataToSend.append(`Colors[${colorIndex}].Images[${imgIndex}].IsMainImage`, imgIndex === 0);
        });
      });

      const response = await fetch(`https://localhost:7208/api/Product/UpdateProduct/${editProductId}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Product updated successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseEditModal();
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to update product', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while updating product', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);

    try {
      const response = await fetch(`https://localhost:7208/api/Product/DeleteProduct/${deleteProductId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Product deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        handleCloseDeleteModal();
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to delete product', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('An error occurred while deleting product', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      const response = await fetch(`https://localhost:7208/api/Product/ToggleActive/${productId}`, {
        method: 'PATCH',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Product ${data.status ? 'activated' : 'deactivated'} successfully!`, {
          position: "top-right",
          autoClose: 2000,
        });
        fetchProducts();
      }
    } catch (err) {
      toast.error('Failed to toggle product status', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const addColor = () => {
    setColors([...colors, {
      colorName: '',
      hexCode: '#000000',
      stock: '',
      price: '',
      images: []
    }]);
  };

  const removeColor = (index) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
    }
  };

  const handleColorNameChange = (index, value) => {
    const newColors = [...colors];
    newColors[index].colorName = value;
    
    const lowerCaseName = value.toLowerCase().trim();
    if (colorNameToHex[lowerCaseName]) {
      newColors[index].hexCode = colorNameToHex[lowerCaseName];
    }
    
    setColors(newColors);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleHexCodeChange = (index, value) => {
    const newColors = [...colors];
    newColors[index].hexCode = value;
    
    const colorName = hexToColorName(value);
    newColors[index].colorName = colorName;
    
    setColors(newColors);
    if (validationError) {
      setValidationError('');
    }
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleImageChange = (colorIndex, e) => {
    const files = Array.from(e.target.files);
    const newColors = [...colors];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newColors[colorIndex].images.push({
          file: file,
          preview: reader.result
        });
        setColors([...newColors]);
      };
      reader.readAsDataURL(file);
    });

    if (validationError) {
      setValidationError('');
    }
  };

  const removeImage = (colorIndex, imageIndex) => {
    const newColors = [...colors];
    newColors[colorIndex].images.splice(imageIndex, 1);
    setColors(newColors);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (validationError) {
      setValidationError('');
    }
  };

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
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <BsExclamationTriangleFill className="me-2" />
        <div>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-1">Products</h2>
                <p className="text-muted mb-0">Manage all product inventory</p>
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={handleShowModal}
                style={{ width: 'auto', whiteSpace: 'nowrap' }}
              >
                <BsPlusCircle />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">All Products</h5>
                  <span className="badge bg-primary rounded-pill">{products.length}</span>
                </div>
              </div>
              <div className="card-body p-4">
                {products.length === 0 ? (
                  <div className="text-center py-5">
                    <BsFolderX style={{ fontSize: '48px', color: '#6c757d' }} />
                    <h5 className="text-muted mt-3">No products found</h5>
                    <p className="text-muted">Start by adding your first product</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="px-4 py-3">#</th>
                          <th scope="col" className="py-3">Image</th>
                          <th scope="col" className="py-3">Name</th>
                          <th scope="col" className="py-3">Category</th>
                          <th scope="col" className="py-3">Brand</th>
                          <th scope="col" className="py-3">Price</th>
                          <th scope="col" className="py-3">Stock</th>
                          <th scope="col" className="py-3">Status</th>
                          <th scope="col" className="py-3 text-end px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => {
                          const mainImage = product.productColors?.[0]?.productImages?.find(img => img.isMainImage) || 
                                           product.productColors?.[0]?.productImages?.[0];
                          
                          return (
                            <tr key={product.productId}>
                              <td className="px-4 py-3 text-muted">{index + 1}</td>
                              <td className="py-3">
                                {mainImage ? (
                                  <img 
                                    src={`https://localhost:7208${mainImage.imageUrl}`} 
                                    alt={product.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                ) : (
                                  <BsImage style={{ fontSize: '50px', color: '#ccc' }} />
                                )}
                              </td>
                              <td className="py-3">
                                <span className="fw-medium">{product.name}</span>
                              </td>
                              <td className="py-3">
                                <span className="badge bg-info text-dark">{product.category?.categoryName}</span>
                              </td>
                              <td className="py-3">
                                <span className="badge bg-secondary">{product.brand?.brandName}</span>
                              </td>
                              <td className="py-3">${product.price}</td>
                              <td className="py-3">{product.stock}</td>
                              <td className="py-3">
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={product.isActive}
                                    onChange={() => handleToggleActive(product.productId, product.isActive)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                              </td>
                              <td className="py-3 text-end px-4">
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    className="btn btn-outline-primary me-2"
                                    title="Edit"
                                    onClick={() => handleShowEditModal(product)}
                                  >
                                    <BsPencil className="me-1" />
                                    Edit
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    title="Delete"
                                    onClick={() => handleShowDeleteModal(product.productId)}
                                  >
                                    <BsTrash className="me-1" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showModal || showEditModal) && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040 }}
            onClick={showModal ? handleCloseModal : handleCloseEditModal}
          ></div>
          
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ zIndex: 1050 }}
            onClick={showModal ? handleCloseModal : handleCloseEditModal}
          >
            <div 
              className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{showModal ? 'Add New Product' : 'Edit Product'}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={showModal ? handleCloseModal : handleCloseEditModal}
                    disabled={submitting}
                  ></button>
                </div>
                <form onSubmit={showModal ? handleSubmit : handleEditSubmit}>
                  <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <h6 className="fw-bold mb-3">Basic Information</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="productName" className="form-label">
                          Product Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="productName"
                          placeholder="Enter product name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="material" className="form-label">
                          Material <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="material"
                          placeholder="e.g., Leather, Canvas, Mesh"
                          value={formData.material}
                          onChange={(e) => handleInputChange('material', e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={submitting}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="price" className="form-label">
                          Price ($) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="price"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="stock" className="form-label">
                          Total Stock (Auto-calculated) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control bg-light"
                          id="stock"
                          placeholder="0"
                          value={formData.stock}
                          disabled={true}
                          style={{ cursor: 'not-allowed' }}
                        />
                        <small className="text-muted">Sum of all color variant stocks</small>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="gender" className="form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          disabled={submitting}
                        >
                          <option value="">Select Gender</option>
                          <option value="Men">Men</option>
                          <option value="Women">Women</option>
                          <option value="Unisex">Unisex</option>
                          <option value="Kids">Kids</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="categoryId" className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="categoryId"
                          value={formData.categoryId}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          disabled={submitting}
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="brandId" className="form-label">
                          Brand <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          id="brandId"
                          value={formData.brandId}
                          onChange={(e) => handleInputChange('brandId', e.target.value)}
                          disabled={submitting || !formData.categoryId}
                        >
                          <option value="">Select Brand</option>
                          {filteredBrands.map((brand) => (
                            <option key={brand.brandId} value={brand.brandId}>
                              {brand.brandName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        disabled={submitting}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Active Product
                      </label>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Color Variants</h6>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary"
                        onClick={addColor}
                        disabled={submitting}
                      >
                        <BsPlusCircle className="me-1" />
                        Add Color
                      </button>
                    </div>

                    {colors.map((color, colorIndex) => (
                      <div key={colorIndex} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Color Variant {colorIndex + 1}</h6>
                            {colors.length > 1 && (
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeColor(colorIndex)}
                                disabled={submitting}
                              >
                                <BsTrash className="me-1" />
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label className="form-label">
                                Color Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Red, Blue, Black"
                                value={color.colorName}
                                onChange={(e) => handleColorNameChange(colorIndex, e.target.value)}
                                disabled={submitting}
                              />
                              <small className="text-muted">Enter name to auto-set hex code</small>
                            </div>
                            <div className="col-md-2 mb-3">
                              <label className="form-label">
                                Hex Code <span className="text-danger">*</span>
                              </label>
                              <input
                                type="color"
                                className="form-control form-control-color w-100"
                                value={color.hexCode}
                                onChange={(e) => handleHexCodeChange(colorIndex, e.target.value)}
                                disabled={submitting}
                                style={{ height: '38px' }}
                              />
                              <small className="text-muted">Pick to auto-set name</small>
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label">
                                Stock <span className="text-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="0"
                                value={color.stock}
                                onChange={(e) => updateColor(colorIndex, 'stock', e.target.value)}
                                disabled={submitting}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label">
                                Price (Optional)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="Default price"
                                value={color.price}
                                onChange={(e) => updateColor(colorIndex, 'price', e.target.value)}
                                disabled={submitting}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">
                              Images <span className="text-danger">*</span>
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleImageChange(colorIndex, e)}
                              disabled={submitting}
                            />
                            <small className="text-muted">First image will be the main display image</small>
                          </div>

                          {color.images.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              {color.images.map((img, imgIndex) => (
                                <div key={imgIndex} className="position-relative" style={{ width: '100px', height: '100px' }}>
                                  <img 
                                    src={img.preview} 
                                    alt={`Preview ${imgIndex}`}
                                    className="img-thumbnail"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                    style={{ padding: '2px 6px', lineHeight: 1 }}
                                    onClick={() => removeImage(colorIndex, imgIndex)}
                                    disabled={submitting}
                                  >
                                    <BsX size={16} />
                                  </button>
                                  {imgIndex === 0 && (
                                    <span className="badge bg-primary position-absolute bottom-0 start-0 m-1" style={{ fontSize: '9px' }}>
                                      Main
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {validationError && (
                      <div className="alert alert-danger" role="alert">
                        {validationError}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer d-flex justify-content-end gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{ minWidth: '120px', flex: '0 0 auto' }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          {showModal ? 'Adding...' : 'Updating...'}
                        </>
                      ) : (
                        showModal ? 'Add Product' : 'Update Product'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={showModal ? handleCloseModal : handleCloseEditModal}
                      disabled={submitting}
                      style={{ minWidth: '120px', flex: '0 0 auto' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div 
            className="modal-backdrop fade show" 
            style={{ zIndex: 1040 }}
            onClick={handleCloseDeleteModal}
          ></div>
          
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{ zIndex: 1050 }}
            onClick={handleCloseDeleteModal}
          >
            <div 
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <BsExclamationTriangleFill className="me-2" />
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={handleCloseDeleteModal}
                    disabled={submitting}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">Are you sure you want to delete this product?</p>
                  <p className="text-muted mb-0 mt-2">This will also delete all associated colors and images. This action cannot be undone.</p>
                </div>
                <div className="modal-footer d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                    disabled={submitting}
                    style={{ minWidth: '120px', flex: '0 0 auto' }}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <BsTrash className="me-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ListProduct;

