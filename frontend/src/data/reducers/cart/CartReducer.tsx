import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cart, CartWithItemsResponse } from "@/interfaces/Icart";

const base = "http://localhost:8080";

interface CartState {
  cart: CartWithItemsResponse | null;
  loading: boolean;
  error: string | null;
  lastOperation: 'fetch' | 'clear' | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
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
export const fetchUserCart = createAsyncThunk( 
  'cart/fetchUserCart',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart/users/${userId}`);
      handleFetchError(response);
      const data: CartWithItemsResponse = await response.json();
      return data as CartWithItemsResponse;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const fetchCartById = createAsyncThunk(
  'cart/fetchById',
  async (cartId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart/${cartId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as Cart;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const emptyCart = createAsyncThunk(
  'cart/empty',
  async (cartId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/cart/${cartId}/clear`, {
        method: "DELETE"
      });
      handleFetchError(response);
      return { cartId };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const cartReducer = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLastOperation: (state) => {
      state.lastOperation = null;
    },
    setCart: (state, action: PayloadAction<CartWithItemsResponse>) => {
      state.cart = action.payload;
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      if (state.cart?.items) {
        const item = state.cart.items.find(item => item.product.id === action.payload.productId);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      }
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      if (state.cart?.items) {
        state.cart.items = state.cart.items.filter(item => item.product.id !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastOperation = 'fetch';
      })
      .addCase(fetchCartById.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.lastOperation = 'fetch';
      })
      .addCase(emptyCart.fulfilled, (state) => {
        if (state.cart) {
          state.cart.items = [];
        }
        state.lastOperation = 'clear';
      })
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { 
  clearCart, 
  clearError, 
  clearLastOperation,
  setCart,
  updateCartItemQuantity,
  removeCartItem
} = cartReducer.actions;

export default cartReducer.reducer;