"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Hooks/reduxHooks";
import { getProductById, getCategoryProducts } from "@/data/reducers/product/ProductReducer"; 
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import Card from "@/components/Card/Card";
import { getGuestFavs, getGuestCart, itemToggleGuestCart, itemToggleGuestFav} from "@/utils/addTo";
import { Product } from "@/interfaces/IProduct";
import { addItemToCart, removeItemFromCart } from "@/data/reducers/cartItems/CartItems";
import { addToWishlist, removeFromWishlist } from "@/data/reducers/Wishlist/WishlistReducer";
import ProductReviews from "@/components/ProductReviews";

export default function PageData({ productid }: { productid: number }) {
  const dispatch = useAppDispatch();
  const {items} = useAppSelector((state) => state.wishlist);
  const {cart} = useAppSelector((state) => state.cart);
  const { isAuthenticated, selectedUser, userType} = useAppSelector(s => s.user);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [inCart, setInCart] = useState<boolean>(false);
  
  // Fixed state selectors - use the correct state structure
  const product = useAppSelector((state) => state.BEProduct.selectedProduct);
  const products = useAppSelector((state) => state.BEProduct.products);
  const loading = useAppSelector((state) => state.BEProduct.loading);

  // helper function to determine if the product is favourite one or not
  const isFav = (productId: number) =>{
    let flag = false;
    if (isAuthenticated) {
      flag = items.some(item => item.product.id === productId);
    }else{
      flag = getGuestFavs()? getGuestFavs().includes(productId) : false;
    }
    return flag;
  }

  const isInCart = (productId: number): boolean => {
    let flag = false;
    if (isAuthenticated && cart?.items) {
      flag = cart?.items.some(item => item.product.id === productId);
    }else{
      flag = getGuestCart()? getGuestCart().includes(productId) : false;
    }
    return flag;
  }

  const handleFavsToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isProductInWishlist = items.some(item => item.product.id === productid);

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
    } catch (error) {
      setIsFavorited(previousState);
      console.error('Failed to toggle favorite:', error);
    }
  }

  const handleCartToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Store previous state for potential rollback
    const previousState = inCart;
    // Optimistic update
    setInCart(!inCart);
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
          } else{
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

  useEffect(() => {
    const nPid = Number(productid);
    dispatch(getProductById(nPid));
    setInCart(isInCart(nPid));
    setIsFavorited(isFav(nPid));
  }, [dispatch, productid]);

  useEffect(() => {
    if (product) {
      dispatch(getCategoryProducts({ 
        cat: product.category, 
        excludeId: product.id 
      }));
    }
  }, [product, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <> 
      <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12 mt-10">
        <div className="relative">
          <Image
            src="/stockImage.jpg" 
            alt={product.name}
            height={800}
            width={500}
            className="rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105 object-cover float-left mr-4 mb-2"
          />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-2xl md:text-3xl font-semibold text-indigo-600">${product.price}</p>
            <p className="text-sm md:text-base text-gray-500 mt-2 sm:mt-0">
              Category: <span className="font-medium">{product.category}</span>
            </p>
          </div>
          
          {/* Additional product info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">Brand: <span className="font-medium">{product.brand}</span></p>
            <p className="text-sm text-gray-600">Weight: <span className="font-medium">{product.weight}g</span></p>
            <p className="text-sm text-gray-600">
              Status: <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
              </span>
            </p>
          </div>
          
          {(userType === "Normal" || userType === "Guest") && (
            <div className="flex flex-col sm:flex-row gap-4 clear-left justify-center mt-2">
              <button
                onClick={handleFavsToggle}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  isFavorited
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? "fill-red-600 text-red-600" : "text-gray-500"}`}
                />
                {isFavorited? "Remove from Favorites" : "Add to Favorites"}
              </button>
              <button
                onClick={handleCartToggle}
                disabled={product.quantity === 0}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                  inCart
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : product.quantity === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <ShoppingCart
                  className={`w-5 h-5 ${inCart ? "fill-blue-600 text-blue-600" : "text-white"}`}
                />
                {inCart ? "Remove from Cart" : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* reviews */}
      <ProductReviews productId={productid} />

      {/* Recommended Products */}
      <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12 mt-4">
        <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
        {products.length > 0 ? (
          <div className="flex flex-row gap-4 p-4 overflow-x-auto">
            {products.map((product: Product) => (
              <Card 
                key={product.id} 
                product={product} 
                height={250} 
                width={200}
                isFav={isFav(product.id)}
                inCart={isInCart(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recommended products found.</p>
        )}
      </div>
    </>
  );
}