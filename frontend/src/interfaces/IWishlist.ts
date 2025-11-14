import { ProductSimpleResponse } from "./IProduct";
import { user } from "./Iuser";

export interface WishlistItem {
  id: number;
  product: ProductSimpleResponse;
  user?: user;
  added_at: string;
}

export interface WishlistRequest {
  userId: number;
  productId: number;
}