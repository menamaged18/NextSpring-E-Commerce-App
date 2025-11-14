import { user, userReq, UserCartResponse, UserOrderResponse, UserWishlistResponse, userLoginReq } from "@/interfaces/Iuser";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Base URL for your API
const base = "http://localhost:8080/userapi";


interface userState {
  users: user[];
  selectedUser: user | null;
  userCart: UserCartResponse | null;
  userOrders: UserOrderResponse | null;
  userWishlist: UserWishlistResponse | null;
  userType: string;
  isAuthenticated: boolean; 
  loading: boolean;
  error: string | null;
}

const initialState: userState = {
  users: [],
  selectedUser: null,
  userCart: null,
  userOrders: null,
  userWishlist: null,
  userType: "Guest",
  isAuthenticated: false,
  loading: false,
  error: null,
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
export const fetchAllUsers = createAsyncThunk('user/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/getallUsers`);
    handleFetchError(response);
    const data = await response.json();
    return data as user[];
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const fetchUserById = createAsyncThunk('user/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/getUserById/${id}`);
    handleFetchError(response);
    const data = await response.json();
    return data as user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const fetchUserCart = createAsyncThunk('user/fetchCart', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/getUserCart/${id}`);
    handleFetchError(response);
    const data = await response.json();
    return data as UserCartResponse;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const fetchUserOrders = createAsyncThunk('user/fetchOrders', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/getUserOrders/${id}`);
    handleFetchError(response);
    const data = await response.json();
    return data as UserOrderResponse;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const fetchUserWishlist = createAsyncThunk('user/fetchWishlist', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/getUserWishlist/${id}`);
    handleFetchError(response);
    const data = await response.json();
    return data as UserWishlistResponse;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const addUser = createAsyncThunk('user/add', async (newUser: userReq, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });
    handleFetchError(response);
    const data = await response.json();
    return data as user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const loginUser = createAsyncThunk('user/login', async (loginData: userLoginReq, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData)
    });
    
    // Handle different HTTP status codes
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${errorText}`);
    }
    
    const data = await response.json();
    return data as user;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, userData }: { id: number; userData: userReq }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      handleFetchError(response);
      const data = await response.json();
      return data as user;
    } catch (error) {
      return handleAsyncError(error, rejectWithValue);
    }
  }
);

export const deleteUser = createAsyncThunk('user/delete', async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`${base}/delete/${id}`, {
      method: "DELETE"
    });
    handleFetchError(response);
    return id;
  } catch (error) {
    return handleAsyncError(error, rejectWithValue);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUserCart: (state) => {
      state.userCart = null;
    },
    clearUserOrders: (state) => {
      state.userOrders = null;
    },
    clearUserWishlist: (state) => {
      state.userWishlist = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    logoutUser: (state) => {
      state.selectedUser = null;
      state.isAuthenticated = false;
      state.userCart = null;
      state.userOrders = null;
      state.userWishlist = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Fulfilled States ---
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<user[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<user>) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<UserCartResponse>) => {
        state.loading = false;
        state.userCart = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<UserOrderResponse>) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action: PayloadAction<UserWishlistResponse>) => {
        state.loading = false;
        state.userWishlist = action.payload;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<user>) => {
        state.loading = false;
        state.users.push(action.payload);
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<user>) => {
        state.loading = false;
        // Update the user in the 'users' array
        state.users = state.users.map(u => 
          u.id === action.payload.id ? action.payload : u
        );
        // Update 'selectedUser' if it's the one that was edited
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        // Remove from 'users' array
        state.users = state.users.filter(user => user.id !== action.payload);
        // Clear 'selectedUser' if it's the one that was deleted
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<user>) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      // --- Matchers for Pending and Rejected ---
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Match any thunk action that is 'rejected'
      .addMatcher(
        (action) => action.type.startsWith('user/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { 
  clearSelectedUser, 
  clearUserCart, 
  clearUserOrders, 
  clearUserWishlist,
  clearError,
  logoutUser
} = userSlice.actions;

export default userSlice.reducer;