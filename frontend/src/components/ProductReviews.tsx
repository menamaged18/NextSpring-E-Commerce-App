"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/Hooks/reduxHooks";
import { ReviewItem, ReviewRequest } from "@/interfaces/IReviews";
import { 
  fetchProductReviews, 
  addReview, 
  editReview, 
  deleteReview 
} from "@/data/reducers/reviews/ReviewsReducer";
import { Star, Edit, Trash2, User, Calendar } from "lucide-react";

interface ProductReviewsProps {
  productId: number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, selectedUser } = useAppSelector((state) => state.user);
  const { items: reviews, loading } = useAppSelector((state) => state.reviews);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    comment: ""
  });

  useEffect(() => {
    dispatch(fetchProductReviews(productId));
  }, [dispatch, productId]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser?.id || !formData.title || !formData.comment) return;

    try {
      if (editingReview) {
        await dispatch(editReview({
          reviewId: editingReview.id,
          request: { ...formData, userId: selectedUser.id }
        })).unwrap();
      } else {
        await dispatch(addReview({
          productId,
          request: { ...formData, userId: selectedUser.id }
        })).unwrap();
      }
      setFormData({ title: "", comment: "" });
      setEditingReview(null);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleEditReview = (review: ReviewItem) => {
    setEditingReview(review);
    setFormData({
      title: review.title,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", comment: "" });
    setEditingReview(null);
    setShowReviewForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // const userReviews = reviews.filter(review => 
  //   editingReview ? true : review.userId === selectedUser?.id
  // );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12 mt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h2>
        {isAuthenticated && selectedUser && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Give your review a title"
                required
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Review *
              </label>
              <textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              {isAuthenticated ? 'No reviews yet. Be the first to share your experience!' : 'No reviews yet.'}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{review.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {review.username || `User ${review.userId}`}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-500 ml-2" />
                    <span className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
                
                {/* Edit/Delete buttons for user's own reviews */}
                {isAuthenticated && review.userId === selectedUser?.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-indigo-600 hover:text-indigo-800 p-1"
                      title="Edit review"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              
              {/* Review metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {/* <span>Product ID: {review.productId}</span> */}
                  {review.userEmail && (
                    <span className="text-xs">{review.userEmail}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}