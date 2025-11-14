'use client';
import { useState } from "react";
import { Heart, ShoppingCart } from 'lucide-react';
import { itemToggleGuestFav, itemToggleGuestCart, itemToggleUserCart } from "@/utils/addTo";
import {useAppDispatch, useAppSelector} from '@/Hooks/reduxHooks';
import { addToWishlist, removeFromWishlist } from "@/data/reducers/Wishlist/WishlistReducer";
import { addItemToCart, removeItemFromCart } from "@/data/reducers/cartItems/CartItems";

interface IActionButtonsProps {
  productid: number;
  isFav: boolean;
  inCart: boolean;
  onFavToggled?: () => void;
}

function ActionButtons({productid, isFav, inCart, onFavToggled}: IActionButtonsProps) {
    const dispatch = useAppDispatch();
    const {isAuthenticated, selectedUser} = useAppSelector(state => state.user);
    const { items } = useAppSelector(state => state.wishlist);
    const { cart } = useAppSelector(state => state.cart);

    const [isFavorited, setIsFavorited] = useState<boolean>(isFav);
    const [inCartC, setInCart] = useState<boolean>(inCart);

    const isProductInWishlist = items.some(item => item.product.id === productid);

    const handleFavsToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Store previous state for potential rollback
        const previousState = isFavorited;
        // Optimistic update
        setIsFavorited(!isFavorited);
        try {
            if (isAuthenticated) {
                if (selectedUser?.id) {
                    // if the product is on fav remove it else add it
                    if(isProductInWishlist){
                        await dispatch(removeFromWishlist({
                            userId: selectedUser.id, 
                            productId: productid
                        })).unwrap();             
                    }else{
                        await dispatch(addToWishlist({
                            userId: selectedUser.id, 
                            productId: productid
                        })).unwrap();   
                    }
                }
            } else {
                itemToggleGuestFav(productid);
            }
            // Notify parent component
            onFavToggled?.(); 
        } catch (error) {
            setIsFavorited(previousState);
            console.error('Failed to toggle favorite:', error);
        }
    }

    const handleCartToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const previousState = inCartC;
        setInCart(!inCartC);
        try {
            if (isAuthenticated) {
                if (selectedUser?.id && cart?.id) {
                    const isProductInCart = cart?.items.some(item => item.product.id === productid);
                    // if the product is on fav remove it else add it
                    if(isProductInCart ){
                    await dispatch(removeItemFromCart({
                        cartId: cart?.id, 
                        productId: productid
                    })).unwrap();             
                    }else{
                    const quantity = 1;
                    await dispatch(addItemToCart({
                        cartId: cart?.id, 
                        productId: productid,
                        quantity: quantity
                    })).unwrap();   
                    }
                } 
            } else {
                itemToggleGuestCart(productid);
            }
        } catch (error) {
            setInCart(previousState);
            console.error('Failed to toggle Cart:', error);
        }
    }

  return (
        <div className="absolute top-3 right-3 flex flex-row gap-1">
        <button
            onClick={handleFavsToggle}
            className="p-1 rounded-full bg-white/80 hover:bg-white transition duration-200"
            aria-label="Add to favorites"
        >
            <Heart
                className={`w-5 h-5 cursor-pointer ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
        </button>
        <button
            onClick={handleCartToggle}
            className="p-1 rounded-full bg-white/80 hover:bg-white transition duration-200 "
            aria-label="Add to cart"
        >
            <ShoppingCart className={`w-5 h-5 cursor-pointer ${inCartC ? 'fill-blue-500' : 'text-gray-500' }`} />
        </button>
        </div>
  )
}

export default ActionButtons