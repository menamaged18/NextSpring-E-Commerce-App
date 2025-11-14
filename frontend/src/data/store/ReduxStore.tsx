// data/ReduxStore.tsx
import { configureStore } from '@reduxjs/toolkit';
import ProductReducers from '@/data/reducers/product/ProductReducer';
import userSlice from '@/data/reducers/user/UserReducer';
import  productReducer  from '../reducers/product/ProductReducer';
import wishlistReducer from '../reducers/Wishlist/WishlistReducer';
import cartReducer from '../reducers/cart/CartReducer';
import cartItemReducer from '../reducers/cartItems/CartItems';
import reviewsReducer from '../reducers/reviews/ReviewsReducer';

export const store = configureStore({
    reducer: {
        products: ProductReducers,
        BEProduct: productReducer,
        user: userSlice,
        wishlist: wishlistReducer,
        cart: cartReducer,
        cartItemReducer: cartItemReducer,
        reviews: reviewsReducer,
    },
});

// to solve typeScript 'unkonwn'error
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;