// EditModal.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch } from '@/Hooks/reduxHooks';
import { editProduct } from '@/data/reducers/product/ProductReducer';
import { ProductReq, Product, productEditParams } from '@/interfaces/IProduct';

type Props = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

export default function EditModal({ product, isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProductReq>({
    name: product.name || '',
    brand: product.brand || '',
    category: product.category || '',
    description: product.description || '',
    is_active: product.is_active ?? true,
    price: product.price || 0,
    quantity: product.quantity || 0,
    weight: product.weight || 0,
  });

  // Keep state in sync if product changes
  useEffect(() => {
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || '',
      description: product.description || '',
      is_active: product.is_active ?? true,
      price: product.price || 0,
      quantity: product.quantity || 0,
      weight: product.weight || 0,
    });
  }, [product]);

  // disable body scroll and add escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: (e.target as HTMLInputElement).checked 
      }));
    } else if (name === 'price' || name === 'quantity' || name === 'weight') {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: Number(value) 
      }));
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  const handleSave = () => {
    const req:productEditParams = {
      productId: product.id,
      newProduct: formData
    }
    dispatch(editProduct(req));
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[999]"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white p-6 rounded-2xl shadow-2xl z-[1000] min-w-[320px] max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
          type="button"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Product</h2>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand *
            </label>
            <input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter brand name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Price, Quantity, Weight - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg) *
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product category"
              required
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Product is active and available for sale
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            type="button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}