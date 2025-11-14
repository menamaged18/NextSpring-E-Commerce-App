import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItem, WishlistRequest } from "@/interfaces/IWishlist";
import { clearGuestFavs, getGuestFavs } from "@/utils/addTo";

// Base URL for your API
const base = "http://localhost:8080";

interface WishlistItemState{
    item: WishlistItem | null;
    status: "Idle" | "Loading" | "Successed" | "Failed";
    error: string | null;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  wishlistItem: WishlistItemState;
  error: string | null;
  lastOperation: 'add' | 'remove' | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  wishlistItem: {
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
export const fetchUserWishlist = createAsyncThunk(
  'wishlist/fetchUserWishlist',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/userapi/getUserWishlist/${userId}`);
      handleFetchError(response);
      const data = await response.json();
      return data.wishList as WishlistItem[];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async ({ userId, productId }: WishlistRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/wishlist/users/${userId}/product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      handleFetchError(response);
      const data = await response.json();
      return data as WishlistItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async ({ userId, productId }: WishlistRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/wishlist/users/${userId}/product/${productId}`, {
        method: "DELETE"
      });
      handleFetchError(response);
      return { userId, productId };
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const getWishlistItemById = createAsyncThunk(
  'wishlist/getById',
  async (wishlistItemId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/wishlist/${wishlistItemId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as WishlistItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const mergeUserFavsWithGuestFavs = createAsyncThunk(
  'wishlist/merge',
  async (userId: number, { dispatch }) => {
    const guestFavs = getGuestFavs();
    
    // Dispatch all add operations without waiting for each one
    guestFavs.forEach(productId => {
      dispatch(addToWishlist({ userId, productId }));
    });

    clearGuestFavs();
    return { mergedCount: guestFavs.length };
  }
);

export const wishlistReducer = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLastOperation: (state) => {
      state.lastOperation = null;
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    removeItemByProductId: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        const existingItem = state.items.find(item => 
          item.id === action.payload.id || 
          item.product.id === action.payload.product.id
        );
        if (!existingItem) {
          state.items.push(action.payload);
        }
        state.lastOperation = 'add';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<{ userId: number; productId: number }>) => {
        state.items = state.items.filter(item => item.product.id !== action.payload.productId);
        state.lastOperation = 'remove';
      })

      // get Wishlist Item
      .addCase(getWishlistItemById.pending, (state)=>{
        state.wishlistItem.status = 'Loading';
      })   
      .addCase(getWishlistItemById.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        state.wishlistItem.status = 'Successed';
        state.wishlistItem.item = action.payload;
      })
      .addCase(getWishlistItemById.rejected, (state, action) => {
        state.wishlistItem.status = 'Failed';
        state.wishlistItem.error = action.error as string;
      })

      // --- Matchers for Pending and Rejected (Reduces code duplication) ---
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/fulfilled') 
            && !action.type.includes('getWishlistItemById'), // Exclude getWishlistItemById
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected')
            && !action.type.includes('getWishlistItemById'), // Exclude getWishlistItemById
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { 
  clearWishlist, 
  clearError, 
  clearLastOperation,
  setWishlistItems,
  removeItemByProductId
} = wishlistReducer.actions;

export default wishlistReducer.reducer;