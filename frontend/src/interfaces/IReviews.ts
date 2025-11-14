// Define interfaces based on your Java DTOs
export interface ReviewItem {
  id: number;
  title: string;
  comment: string;
  created_at: string;
  productId: number;
  userId: number;
  username: string;
  userEmail: string;
  // Add other fields from ReviewResponse as needed
}

export interface ReviewRequest {
  title: string;
  comment: string;
  userId: number;
}