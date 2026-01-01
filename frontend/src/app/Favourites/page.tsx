"use client";
import { getGuestFavs, getGuestCart, getUserCart,
         clearGuestFavs} from "@/utils/addTo";
import {useAppSelector, useAppDispatch} from "@/Hooks/reduxHooks";
import {fetchUserWishlist, mergeUserFavsWithGuestFavs} from '@/data/reducers/Wishlist/WishlistReducer';
import { clearProducts, getProductsByIds } from '@/data/reducers/product/ProductReducer';
import { useEffect } from "react";
import Card from "@/components/Card/Card";
import { usePrevious } from "@/Hooks/usePrevious";
import { useRouter } from 'next/navigation';

function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading } = useAppSelector((state) => state.BEProduct);
  const { selectedUser, isAuthenticated } = useAppSelector(state => state.user);
  const {items, loading: wishlistLoading} = useAppSelector(state => state.wishlist);
  const {cart, loading: cartLoading} = useAppSelector(state => state.cart);

  // const userType = useAppSelector( (state) => state.user.userType );

  const overallLoading = productsLoading || wishlistLoading;

  // for static product list json one
  const incart = isAuthenticated && selectedUser?.name 
    ? getUserCart(selectedUser?.name) : getGuestCart();

  // for products that in the database(DB)
  const isInCart = (productId: number): boolean => {
    let flag = false;
    // if there is a cart and the cart contians items then return that items
    if (isAuthenticated && cart?.items) {
      flag = cart?.items.some(item => item.product.id === productId);
    }else{
      flag = getGuestCart()? getGuestCart().includes(productId) : false;
    }
    return flag;
  }

  const previsAuthenticated = usePrevious(isAuthenticated);

  // clear products state --> to replace the state with the favourite ones  
  useEffect(()=> {
    dispatch(clearProducts())
  }, [])

  // this triggers when a user logs out and send him to home page
  useEffect(() => {
    if (previsAuthenticated === true && isAuthenticated === false) {
      router.push("/");
    }
  }, [isAuthenticated, previsAuthenticated, router]);

  // whenever favorites change, fetch them
  useEffect(() => {
    // 1. Get the Favs *inside* the effect
    const guestFavs = getGuestFavs();
    const hasGuestFavs = guestFavs.length > 0;

    // Case 1: User is LOGGED IN
    if (isAuthenticated) {
      // Sub-case 1.1: User is logged in AND has a guest Favs
      if (hasGuestFavs) {
        // Ask the user to merge
        if (window.confirm("Merge guest favourites with your favourites?")) {
          if (selectedUser?.id) {
            dispatch(mergeUserFavsWithGuestFavs(selectedUser.id));
            dispatch(fetchUserWishlist(selectedUser?.id));
          }
        } else {
          clearGuestFavs();
          selectedUser?.id && dispatch(fetchUserWishlist(selectedUser?.id));
        }
      } else {
        // User is logged in, NO guest Favs.
        selectedUser?.id && dispatch(fetchUserWishlist(selectedUser?.id));
      }
    } else {
      // Case 2: User is NOT LOGGED IN
      dispatch(getProductsByIds(guestFavs));
    }
    
  }, [isAuthenticated, selectedUser?.name, dispatch]);

  const handleFavsToggle = () => {
    if (isAuthenticated) {
      if (selectedUser?.id) {
        dispatch(fetchUserWishlist(selectedUser?.id));
      }
    } else {
      const currentFavsIds = getGuestFavs();
      dispatch(getProductsByIds(currentFavsIds)); 
    }
  };

  const DBProducts = items.map(item => item.product).filter(Boolean);
  
  if (overallLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-center text-xl text-gray-700 mt-4">Loading your favorites...</p>
      </div>
    );
  }

  let content;
  
  if ((products.length === 0) && (DBProducts.length === 0)) {  
    content = (
      <div className="flex flex-col items-center justify-center p-10 rounded-lg">
        <p className="text-center text-xl text-gray-500 mt-4 font-semibold">Your favorites list is empty</p>
        <p className="text-center text-sm text-gray-400 mt-2">Start adding products you love!</p>
      </div>
    );
  } else if ((products.length === 0) && (DBProducts.length > 0)) {
    content = (
      <div className="p-10 flex flex-row flex-wrap gap-4 justify-center max-w-7xl mx-auto">
        {DBProducts.map((product) => (
          <Card 
            key={product.id}
            product={product}
            height={380}
            width={250}
            isFav={true}
            inCart={isInCart(product.id)}
            onFavToggled={handleFavsToggle}
          />
        ))}
      </div>    
    );  
  } else {
    content = (
      <div className="p-10 flex flex-row flex-wrap gap-4 justify-center max-w-7xl mx-auto">
        {products.map((product) => (
          <Card 
            key={product.id}
            product={product}
            height={380}
            width={250}
            isFav={true}
            inCart={incart.includes(product.id)}
            onFavToggled={handleFavsToggle}
          />
        ))}
      </div>    
    );
  }

  return (
    <div className="container mx-auto">
      {content}
    </div>
  );
}

export default Page;