import { ReviewItem } from "./IReviews";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  cost_price: number | null;
  category: string;
  description: string;
  brand: string;
  weight: number;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
  reviews: ReviewItem[];
}

export interface ProductSimpleResponse{
  id: number;
  name: string;
  // quantity: number; <-- i didn't decide it should be added or not yet
  price: number;
  category: string;
  description: string;
  brand: string;
  weight: number;
  is_active: boolean;
}

export interface ProductReq {
  name: string;
  quantity: number;
  price: number;
  category: string;
  description: string;
  brand: string;
  weight: number;
  is_active: boolean;
}

export interface productEditParams {
  productId: number;
  newProduct: ProductReq;
}