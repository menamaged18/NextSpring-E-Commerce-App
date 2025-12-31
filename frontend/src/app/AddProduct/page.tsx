"use client";
import React, { useState } from 'react';
import {useAppSelector, useAppDispatch} from "@/Hooks/reduxHooks";
import { ProductReq } from '@/interfaces/IProduct';
import {addProduct} from '@/data/reducers/product/ProductReducer'

const AddProductForm = () => {
  const dispatch = useAppDispatch();
  const intializeProduct = {
    name: '',
    brand: '',
    category: '',
    description: '',
    is_active: true,
    price: 0,
    quantity: 0,
    weight: 0,
  }
  const userType = useAppSelector( (state) => state.user.selectedUser?.userType || "Guest" );
  const {error} = useAppSelector( state => state.BEProduct)
  const [productData, setProductData] = useState<ProductReq>(intializeProduct);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addProduct(productData));
    
    alert('Form submitted!');
    if(error){
      alert(error);
    }
  
    // reset state
    setProductData(intializeProduct);
  };

  return (
    <div className="flex items-center justify-center p-6 m-2">
    {userType === "Admin" && 
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Add New Product 🛍️
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Product name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={productData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Organic Coffee Beans"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          {/* Brand Input */}
          <div>
            <label htmlFor="brand" className="block text-sm font-semibold text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              value={productData.brand}
              onChange={handleChange}
              required
              placeholder="e.g., Premium Roasters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              value={productData.description}
              onChange={handleChange}
              required
              placeholder="Provide a detailed description of the product..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out resize-y"
            ></textarea>
          </div>

          {/* Price, Quantity, Weight Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={productData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={productData.quantity}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                id="weight"
                value={productData.weight}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              />
            </div>
          </div>

          {/* Category Input */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={productData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Food & Beverage"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={productData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
              Product is active and available for sale
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Add Product
            </button>
          </div>

        </form>
      </div>
    }
    {(userType === "Normal" || userType === "Guest") && 
        <div>
            You have to be an admin To access this page!!
        </div>
    } 
    </div>
  );
};

export default AddProductForm;