import { Product, ProductReq, productEditParams} from "@/interfaces/IProduct";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { METHODS } from "http";

const base = "http://localhost:8080/";

// Define the state interface
interface ProductState {
  products: Product[];
  selectedProduct: Product | null; 
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null, 
  loading: false,
  error: null,
};

// Define payload for updateProductQuantity action
interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

export const fetchProducts = createAsyncThunk('products/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}product/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as Product[];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getProductById = createAsyncThunk("products/getById", 
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}product/${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as Product;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const addProduct = createAsyncThunk("products/add", 
  async (newProduct: ProductReq, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}product/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Product creation failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getCategoryProducts = createAsyncThunk("products/getByCategory",
  async ({ cat, excludeId }: { cat: string; excludeId?: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${base}product/category/${cat}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Filter out the current product if excludeId is provided
      const filteredData = excludeId 
        ? data.filter((product: Product) => product.id !== excludeId)
        : data;
      return filteredData as Product[];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getProductsByIds = createAsyncThunk("products/list", 
  async (ids: number[], {rejectWithValue}) => {
    try{
      const response = await fetch(`${base}product/list`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
      }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);       
      }
      const data = await response.json();
      return data as Product[];
    }catch(error){
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("unkown error occured");
    }
})

export const editProduct = createAsyncThunk('products/edit', 
    async ({productId, newProduct}: productEditParams, {rejectWithValue}) => {
  try{
    const response = await fetch(`${base}product/edit/${productId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as Product;
  } catch(error){
    if(error instanceof Error){
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (productId: number, {rejectWithValue}) =>{
  try{
    const response = await fetch(`${base}product/delete/${productId}`, {
        method: "DELETE"
      }
    );
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return productId;
  }catch(e){
    if (e instanceof Error) {
      return rejectWithValue(e.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
})

export const uploadImage = async (file: File, productId: number) => {
  const formData = new FormData();
  formData.append("file", file);

  await fetch(`${base}/products/${productId}/image`, {
    method: "POST",
    body: formData,
  });
};


export const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.selectedProduct = null;
    },
    updateProductQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.quantity = quantity;
      }
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      // Get Product By ID
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      // Get Category Products
      .addCase(getCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByIds.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      // Add Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      // Edit Product
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Find the index of the product that was edited
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );

        // If found, replace it with the updated product from the server
        if (index !== -1) {
          state.products[index] = action.payload;
        }

        // update selectedProduct 
        // if (state.selectedProduct?.id === action.payload.id) {
        //   state.selectedProduct = action.payload;
        // }
      })
      // delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // update the state
        state.products = state.products.filter(product => product.id != action.payload);
      })

      // all pending states
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // all rejected States
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload as string;
          state.products = [];
        }
      )
  },
});


export const { clearProducts, updateProductQuantity, clearSelectedProduct } = productReducer.actions;
export default productReducer.reducer;