"use client";
import { getGuestCart, clearGuestCart } from "@/utils/addTo";
import { useAppSelector, useAppDispatch } from "@/Hooks/reduxHooks";
import { useEffect, useRef, useState } from "react"; // Add useState
import { useRouter } from 'next/navigation';
import { usePrevious } from '@/Hooks/usePrevious';
import HorizontalCard from "@/components/Card/HorizontalCard";
import CheckoutSummary from "@/components/Checkout/CheckoutSummary";
import Link from "next/link";
import { mergeUserCartWithGuestCart } from "@/data/reducers/cartItems/CartItems";
import { fetchUserCart } from "@/data/reducers/cart/CartReducer";
import { clearProducts, getProductsByIds } from "@/data/reducers/product/ProductReducer";

function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading: productLoading, error } = useAppSelector((state) => state.BEProduct);
  const { cart, loading: cartLoading } = useAppSelector(state => state.cart);
  const { selectedUser, isAuthenticated } = useAppSelector(state => state.user);
  
  const hasMergedRef = useRef(false);
  const [isMerging, setIsMerging] = useState(false); 

  // clear products state --> to replace the state with the Cart items ones  
  useEffect(() => {
    dispatch(clearProducts())
  }, [])

  const overallLoading = cartLoading || productLoading || isMerging;

  const prevIsAuthenticated = usePrevious(isAuthenticated);

  // if the user logs out in the cart page direct him to home page 
  useEffect(() => {
    if (prevIsAuthenticated === true && isAuthenticated === false) {
      router.push("/");
    }
  }, [isAuthenticated, prevIsAuthenticated, selectedUser?.name, router]);

  useEffect(() => {
    // Reset merge flag when user logs out
    if (prevIsAuthenticated === true && isAuthenticated === false) {
      hasMergedRef.current = false;
    }
  }, [isAuthenticated, prevIsAuthenticated]);

  useEffect(() => {
    // Skip if merge has already been attempted
    if (hasMergedRef.current) return;

    const guestCart = getGuestCart();
    const hasGuestCart = guestCart.length > 0;

    // Case 1: User is LOGGED IN
    if (isAuthenticated && selectedUser?.id) {
      // Sub-case 1.1: User is logged in AND has a guest cart
      if (hasGuestCart) {
        hasMergedRef.current = true; // Mark as attempted
        
        // Ask the user to merge
        if (window.confirm("Merge guest cart with your cart?")) {
          setIsMerging(true);
          dispatch(mergeUserCartWithGuestCart(selectedUser.id))
            .unwrap()
            .then(() => {
              // After merge is complete, fetch the updated cart
              return dispatch(fetchUserCart(selectedUser.id)).unwrap();
            })
            .then(() => {
              setIsMerging(false);
            })
            .catch((error) => {
              console.error("Merge failed:", error);
              setIsMerging(false);
              // Still fetch cart on error
              dispatch(fetchUserCart(selectedUser.id));
            });
        } else {
          clearGuestCart();
          dispatch(fetchUserCart(selectedUser.id));
        }
      } else {
        // User is logged in, NO guest cart.
        hasMergedRef.current = true;
        dispatch(fetchUserCart(selectedUser.id));
      }
    } else if (!isAuthenticated) {
      // Case 2: User is NOT LOGGED IN
      dispatch(getProductsByIds(guestCart));
    }
  }, [isAuthenticated, selectedUser?.id, dispatch]);

  // Add this effect to refetch cart when merge completes
  useEffect(() => {
    if (isAuthenticated && selectedUser?.id && !isMerging && hasMergedRef.current) {
      // Refetch cart to ensure we have the latest data
      dispatch(fetchUserCart(selectedUser.id));
    }
  }, [isMerging, isAuthenticated, selectedUser?.id, dispatch]);

  const handleInCartToggle = async () => {
    if (isAuthenticated && selectedUser?.id) {
      dispatch(fetchUserCart(selectedUser.id));
    } else {
      dispatch(getProductsByIds(getGuestCart()));
    }
  };

  const cartProducts = cart?.items?.map(item => item.product).filter(Boolean) || [];

  const productlist = (isAuthenticated && cartProducts && cartProducts.length > 0)
    ? cartProducts
    : (!isAuthenticated && products.length > 0)
      ? products
      : null;

  // Calculate subtotal
  const subtotal = productlist
    ? productlist.reduce((sum, product) => sum + product.price, 0)
    : 0;

  let content;

  if (overallLoading) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
        <p className="text-xl text-gray-600 mt-6 font-semibold">
          {isMerging ? "Merging your cart..." : "Loading your cart..."}
        </p>
      </div>
    );
  }

  if (error) {
    content = (
      <div className="flex flex-col items-center justify-center p-10 rounded-xl bg-red-50 border border-red-200 shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-2xl text-red-700 mt-4 font-bold">Oops! An error occurred.</p>
        <p className="text-md text-red-500 mt-2 text-center">{error}</p>
        <button className="mt-6 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (productlist == null) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H18.6L22 13M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m0-4h18" />
        </svg>
        <p className="text-2xl text-gray-500 mt-6 font-bold">Your cart is empty.</p>
        <p className="text-lg text-gray-400 mt-2">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/" className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-4">Items</h2>
              <div className="space-y-6 gap-5">
                {productlist.map((product) => (
                  <HorizontalCard
                    key={product.id}
                    product={product}
                    height={380}
                    width={250}
                    onInCartToggle={handleInCartToggle}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary subtotal={subtotal} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {content}
    </main>
  );
}

export default Page;