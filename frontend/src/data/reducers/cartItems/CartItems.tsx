import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartItemRequest } from "@/interfaces/ICartItem";
import { clearGuestCart, getGuestCart } from "@/utils/addTo";

const base = "http://localhost:8080";

interface CartItemState {
  item: CartItem | null;
  status: "Idle" | "Loading" | "Succeeded" | "Failed";
  error: string | null;
}

interface CartItemsState {
  loading: boolean;
  cartItem: CartItemState;
  error: string | null;
  lastOperation: 'add' | 'update' | 'remove' | null;
}

const initialState: CartItemsState = {
  loading: false,
  cartItem: {
    item: null,
    status: "Idle",
    error: null
  },
  error: null,
  lastOperation: null,
};

const handleFetchError = (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
};

const handleAsyncError = (error: unknown, rejectWithValue: (value: string) => any) => {
  if (error instanceof Error) {
    return rejectWithValue(error.message);
  }
  return rejectWithValue('An unknown error occurred');
};

// Async thunks
export const addItemToCart = createAsyncThunk(
  'cartItem/add',
  async ({ userId, productId, quantity }: CartItemRequest & { userId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart-items/add/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, quantity })
      });
      handleFetchError(response);
      const data = await response.json();
      return data as CartItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cartItem/update',
  async ({ cartId, productId, quantity }: CartItemRequest & { cartId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart-items/cart/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId, quantity })
      });
      handleFetchError(response);
      const data = await response.json();
      return data as CartItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cartItem/remove',
  async ({ cartId, productId }: { cartId: number; productId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart-items/cart/${cartId}/product/${productId}`, {
        method: "DELETE"
      });
      handleFetchError(response);
      return { cartId, productId };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const removeItemByCartItemId = createAsyncThunk(
  'cartItem/removeById',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart-items/${cartItemId}`, {
        method: "DELETE"
      });
      handleFetchError(response);
      return { cartItemId };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const fetchCartItemById = createAsyncThunk(
  'cartItem/fetchById',
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart-items/${cartItemId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as CartItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const mergeUserCartWithGuestCart = createAsyncThunk(
  'wishlist/merge',
  async (userId: number, { dispatch }) => {
    const guestCart = getGuestCart();
    // console.log(guestCart)
    
    // Dispatch all add operations without waiting for each one
    guestCart.forEach(productId => {
      const quantity = 1;
      dispatch(addItemToCart({ userId, productId, quantity}));
    });

    clearGuestCart();
    return { mergedCount: guestCart.length };
  }
);

export const cartItemReducer = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    clearCartItem: (state) => {
      state.cartItem.item = null;
      state.cartItem.error = null;
      state.cartItem.status = "Idle";
    },
    clearError: (state) => {
      state.error = null;
      state.cartItem.error = null;
    },
    clearLastOperation: (state) => {
      state.lastOperation = null;
    },
    setCartItem: (state, action: PayloadAction<CartItem>) => {
      state.cartItem.item = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.cartItem.item = action.payload;
        state.lastOperation = 'add';
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.cartItem.item = action.payload;
        state.lastOperation = 'update';
      })
      .addCase(removeItemFromCart.fulfilled, (state) => {
        state.cartItem.item = null;
        state.lastOperation = 'remove';
      })
      .addCase(removeItemByCartItemId.fulfilled, (state) => {
        state.cartItem.item = null;
        state.lastOperation = 'remove';
      })
      
      // Fetch Cart Item by ID
      .addCase(fetchCartItemById.pending, (state) => {
        state.cartItem.status = 'Loading';
      })   
      .addCase(fetchCartItemById.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.cartItem.status = 'Succeeded';
        state.cartItem.item = action.payload;
      })
      .addCase(fetchCartItemById.rejected, (state, action) => {
        state.cartItem.status = 'Failed';
        state.cartItem.error = action.error as string;
      })

      // Matchers for general loading states
      .addMatcher(
        (action) => action.type.startsWith('cartItem/') && 
                   action.type.endsWith('/pending') &&
                   !action.type.includes('fetchCartItemById'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cartItem/') && 
                   action.type.endsWith('/fulfilled') &&
                   !action.type.includes('fetchCartItemById'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cartItem/') && 
                   action.type.endsWith('/rejected') &&
                   !action.type.includes('fetchCartItemById'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { 
  clearCartItem, 
  clearError, 
  clearLastOperation,
  setCartItem
} = cartItemReducer.actions;

export default cartItemReducer.reducer;