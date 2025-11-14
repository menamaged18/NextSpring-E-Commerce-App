// // EditModal.tsx
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { useAppDispatch } from '@/Hooks/reduxHooks';
// import { editProduct } from '@/data/reducers/ProductReducers';
// import { Product } from '@/interfaces/types';
// import Image from 'next/image'; // Import the Image component

// type Props = {
//   product: Product;
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function EditModal({ product, isOpen, onClose }: Props) {
//   const dispatch = useAppDispatch();
//   const [formData, setFormData] = useState({
//     title: product.title,
//     description: product.description,
//     price: product.price,
//     category: product.category,
//     imagePath: product.imagePath, // Add imagePath to form data
//   });

//   // Keep state in sync if product changes
//   useEffect(() => {
//     setFormData({
//       title: product.title,
//       description: product.description,
//       price: product.price,
//       category: product.category,
//       imagePath: product.imagePath,
//     });
//   }, [product]);

//   // disable body scroll and add escape key handler
//   useEffect(() => {
//     if (!isOpen) return;
//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = 'hidden';
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     window.addEventListener('keydown', onKey);
//     return () => {
//       document.body.style.overflow = originalOverflow;
//       window.removeEventListener('keydown', onKey);
//     };
//   }, [isOpen, onClose]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     // keep price as number
//     setFormData((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
//   };

//   const handleSave = () => {
//     dispatch(editProduct({ ...product, ...formData }));
//     onClose();
//   };

//   if (!isOpen) return null;

//   const modalContent = (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[999]"
//         onClick={onClose}
//       />

//       {/* Modal card */}
//       <div
//         role="dialog"
//         aria-modal="true"
//         className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//                    bg-white p-6 rounded-2xl shadow-2xl z-[1000] min-w-[320px] max-w-md"
//         // IMPORTANT: stop click propagation so clicks inside modal don't close it
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           aria-label="Close"
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
//           type="button"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Edit Product</h2>

//         {/* Image display */}
//         <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
//           <Image
//             src={formData.imagePath}
//             alt="Product image"
//             fill
//             style={{ objectFit: 'contain' }}
//             className="transform transition duration-500"
//           />
//         </div>

//         <div className="space-y-3">
//           <input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Title"
//             autoFocus
//           />
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Description"
//             rows={4}
//           />
//           <input
//             name="price"
//             type="number"
//             value={String(formData.price)}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Price"
//           />
//           <input
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Category"
//           />
//           {/* Input for image URL */}
//           <input
//             name="imagePath"
//             value={formData.imagePath}
//             onChange={handleChange}
//             className="w-full p-2 border rounded-lg"
//             placeholder="Image URL"
//           />
//         </div>

//         <button
//           onClick={handleSave}
//           className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
//           type="button"
//         >
//           Save Changes
//         </button>
//       </div>
//     </>
//   );

//   // Render modal into document.body to fully isolate it from Card DOM/hovers
//   return createPortal(modalContent, document.body);
// }