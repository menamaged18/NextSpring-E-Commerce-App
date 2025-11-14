import React from 'react'
import { Product, ProductSimpleResponse } from "@/interfaces/IProduct";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from '@/Hooks/reduxHooks';
import { removeItemFromCart } from '@/data/reducers/cartItems/CartItems';
import { getGuestCart, itemToggleGuestCart } from '@/utils/addTo';
import { getProductsByIds } from '@/data/reducers/product/ProductReducer';

interface Iprops {
  product: Product | ProductSimpleResponse
  height?: number
  width?: number
  isFav?: boolean
  inCart?: boolean
  onFavToggle?: () => void;
  onInCartToggle?: (productId: number) => void; // This callback will trigger a refresh
}

function HorizontalCard({product, onInCartToggle}: Iprops) {
    const dispatch = useAppDispatch();
    const { cart } = useAppSelector(state => state.cart);

    const { isAuthenticated } = useAppSelector((state) => state.user);
    const handleRemove = async () => {
        if (isAuthenticated) {
            if (cart?.id) {
                await dispatch(removeItemFromCart({
                    cartId: cart?.id, 
                    productId: product.id
                })).unwrap();             
            }
            } else {
            // guest user cart toggle
            itemToggleGuestCart(product.id);
            dispatch(getProductsByIds(getGuestCart())); 
        }
        if (onInCartToggle) {
            onInCartToggle(product.id); // Trigger parent component to refresh
        }
    }
    
    return (
        <div className="flex py-6">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                    src="/imageplaceholder.jpg"
                    alt={product.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p className="ml-4">${product.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Quantity: 1</p>
                    <div className="flex">
                        <button 
                            type="button" 
                            className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                            onClick={handleRemove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HorizontalCard