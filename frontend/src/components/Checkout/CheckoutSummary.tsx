"use client";
import { useAppSelector } from '@/Hooks/reduxHooks';
import React, { useState } from 'react';

interface CheckoutSummaryProps {
  subtotal: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ subtotal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAppSelector(state => state.user);
  
  // Calculations
  const taxRate = 0.14; 
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 25.99;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if(isAuthenticated){
      setIsModalOpen(true);
    }else{
      alert("you need to be logged in first");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProceedToPay = () => {
    alert('Redirecting to payment gateway...');
    // TODO: Later direct to Payment Page
    closeModal();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg sticky top-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-4">Order Summary</h2>
        
        <div className="flex justify-between items-center mb-4 text-lg">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
        
        <button 
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-opacity-50 backdrop-blur-lg z-50"
            onClick={closeModal}
          />
          
          {/* Modal Card */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl z-50 min-w-[400px] max-w-md">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Checkout Summary</h2>
            
            {/* Cost Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (14%):</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Pay Button */}
            <button
              onClick={handleProceedToPay}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md cursor-pointer"
            >
              Proceed to Pay - ${total.toFixed(2)}
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your payment information will be processed securely
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutSummary;