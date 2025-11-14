import { ReviewItem, ReviewRequest } from "@/interfaces/IReviews";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReviewItemState {
  item: ReviewItem | null;
  status: "Idle" | "Loading" | "Successed" | "Failed";
  error: string | null;
}

interface ReviewsState {
  items: ReviewItem[];
  loading: boolean;
  reviewItem: ReviewItemState;
  error: string | null;
  lastOperation: 'add' | 'edit' | 'delete' | null;
}

const initialState: ReviewsState = {
  items: [],
  loading: false,
  reviewItem: {
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

// Base URL for your API
const base = "http://localhost:8080";

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/products/${productId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as ReviewItem[];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/users/${userId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as ReviewItem[];
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async ({ productId, request }: { productId: number; request: ReviewRequest }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/products/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      handleFetchError(response);
      const data = await response.json();
      return data as ReviewItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const editReview = createAsyncThunk(
  'reviews/edit',
  async ({ reviewId, request }: { reviewId: number; request: ReviewRequest }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
      });
      handleFetchError(response);
      const data = await response.json();
      return data as ReviewItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const getReviewById = createAsyncThunk(
  'reviews/getById',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/${reviewId}`);
      handleFetchError(response);
      const data = await response.json();
      return data as ReviewItem;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/reviews/${reviewId}`, {
        method: "DELETE"
      });
      handleFetchError(response);
      return reviewId;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const reviewsReducer = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLastOperation: (state) => {
      state.lastOperation = null;
    },
    setReviews: (state, action: PayloadAction<ReviewItem[]>) => {
      state.items = action.payload;
    },
    removeReviewById: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch product reviews
      .addCase(fetchProductReviews.fulfilled, (state, action: PayloadAction<ReviewItem[]>) => {
        state.items = action.payload;
      })
      // Fetch user reviews
      .addCase(fetchUserReviews.fulfilled, (state, action: PayloadAction<ReviewItem[]>) => {
        state.items = action.payload;
      })
      // Add review
      .addCase(addReview.fulfilled, (state, action: PayloadAction<ReviewItem>) => {
        state.items.push(action.payload);
        state.lastOperation = 'add';
      })
      // Edit review
      .addCase(editReview.fulfilled, (state, action: PayloadAction<ReviewItem>) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.lastOperation = 'edit';
      })
      // Delete review
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.lastOperation = 'delete';
      })
      // Get review by ID
      .addCase(getReviewById.pending, (state) => {
        state.reviewItem.status = 'Loading';
      })   
      .addCase(getReviewById.fulfilled, (state, action: PayloadAction<ReviewItem>) => {
        state.reviewItem.status = 'Successed';
        state.reviewItem.item = action.payload;
      })
      .addCase(getReviewById.rejected, (state, action) => {
        state.reviewItem.status = 'Failed';
        state.reviewItem.error = action.error.message || 'Failed to fetch review';
      })
      // Matchers for pending and rejected states
      .addMatcher(
        (action) => action.type.startsWith('reviews/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('reviews/') && action.type.endsWith('/fulfilled') 
            && !action.type.includes('getReviewById'), // Exclude getReviewById
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('reviews/') && action.type.endsWith('/rejected')
            && !action.type.includes('getReviewById'), // Exclude getReviewById
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { 
  clearReviews, 
  clearError, 
  clearLastOperation,
  setReviews,
  removeReviewById
} = reviewsReducer.actions;

export default reviewsReducer.reducer;