"use client";
import { useEffect } from "react";
import Card from "../components/Card/Card";
import {useAppSelector, useAppDispatch} from "@/Hooks/reduxHooks";
import { getGuestFavs, getGuestCart, getUserCart} from "@/utils/addTo";
import { usePrevious } from "@/Hooks/usePrevious";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/loading/PageLoading";
import { fetchUserWishlist } from "@/data/reducers/Wishlist/WishlistReducer";
import { fetchProducts } from "@/data/reducers/product/ProductReducer";
import { fetchUserCart } from "@/data/reducers/cart/CartReducer";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading, error } = useAppSelector(s => s.BEProduct);
  const {items, loading: wishlistLoading} = useAppSelector(state => state.wishlist);
  const {cart, loading: cartLoading} = useAppSelector(state => state.cart);
  const { isAuthenticated, selectedUser } = useAppSelector((state) => state.user);

  const overallLoading = productsLoading || wishlistLoading || cartLoading;

  // helper function to determine if the product is favourite one or not
  const isFav = (productId: number): boolean =>{
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
  
  // whenever favorites change, fetch them
  useEffect(() => {
    // Only fire if we are authenticated AND we have a user ID.
    if (isAuthenticated && selectedUser?.id) {
      dispatch(fetchUserWishlist(selectedUser.id));
    } 
  }, [isAuthenticated, selectedUser?.id, dispatch]);

  // whenever cart change, fetch it
  useEffect(() => {
    // Only fire if we are authenticated AND we have a user ID.
    if (isAuthenticated && selectedUser?.id) {
      dispatch(fetchUserCart(selectedUser.id));
    } 
  }, [isAuthenticated, selectedUser?.id, dispatch]);

  const prevIsLoggedIn = usePrevious(isAuthenticated);

  useEffect(() => {
    if (prevIsLoggedIn === true && isAuthenticated === false) {
      // router.push("/"); // didn't work
      // router.refresh(); // didn't work
      window.location.reload();
    }
  }, [isAuthenticated, prevIsLoggedIn, router]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  if (overallLoading) {
    return <div className="container mx-auto"><PageLoading fullScreen={false}/></div>;
  }

  if (error) {
    return <div className="container mx-auto flex flex-col items-center justify-center mt-10">
              Error: {error}
            </div>;
  }

  if (!products || products.length === 0) {
    return <div className="container mx-auto">No products found</div>;
  }
  
  return (
    <div className="container mx-auto">
      {/* <CustomDialog  closedBtitle="Add product"/> */}
      <div className="p-10 flex flex-row flex-wrap gap-4 justify-center max-w-7xl mx-auto">
        {products.map((product) => (
          <Card 
            key={product.id}
            product = {product}
            height={380}
            width={250}
            isFav={isFav(product.id)}
            inCart={isInCart(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
