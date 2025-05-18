import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  readonly?: boolean;
}

export function Rating({ rating, setRating, readonly = false }: RatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => setRating?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} p-1`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface DoctorRatingProps {
  doctorId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  canReview: boolean;
}

export default function DoctorRating({ doctorId, averageRating, totalReviews, reviews, canReview }: DoctorRatingProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission
    console.log({ doctorId, rating, comment });
    setShowReviewForm(false);
    setRating(0);
    setComment('');
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="flex items-center space-x-4">
        <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
        <div>
          <Rating rating={averageRating} readonly />
          <p className="text-sm text-gray-500">{totalReviews} reviews</p>
        </div>
      </div>

      {/* Review Form */}
      {canReview && (
        <div>
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <Rating rating={rating} setRating={setRating} />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{review.patientName}</span>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                      Verified Patient
                    </span>
                  )}
                </div>
                <Rating rating={review.rating} readonly />
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}