"use client";
import React, { useState } from 'react';
import {useAppSelector} from "@/Hooks/reduxHooks";


export interface Product {
  id: number;
  image: File | null;
  title: string;
  description: string;
  price: number;
  category: string;
}

const AddProductForm = () => {
  const userType = useAppSelector( (state) => state.user.staticData.type );
  const [productData, setProductData] = useState<Product>({
    id: 0,
    image: null,
    title: '',
    description: '',
    price: 0,
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'image' && e.target.type === 'file') {
        const fileInput = e.target as HTMLInputElement;
        setProductData({
        ...productData,
        image: fileInput.files?.[0] || null,
        });
    } else {
        setProductData({
        ...productData,
        [name]: value,
        });
    }
    };

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send the data to your backend API.
    // The 'productData' state now contains all the form values,
    // including the image file in productData.image.
    // console.log("Submitting product data:", productData);
    
    // upload the file and get a URL to store in your database.
    alert('Form submitted! Check the console for data.');
    
    setProductData({
      id: 0,
      image: null,
      title: '',
      description: '',
      price: 0,
      category: '',
    });
  };

  return (
    <div className="flex items-center justify-center p-6 m-2">
    {userType === "A" && 
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-xl">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Add New Product 🛍️
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Product Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={productData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Organic Coffee Beans"
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

          {/* Price Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
                Price
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
          </div>

          {/* Product Image Input */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200 ease-in-out"
            />
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
    {(userType === "N" || userType === " ") && 
        <div>
            You have to be an dmin To access this page!!
        </div>
    } 
    </div>
  );
};

export default AddProductForm;