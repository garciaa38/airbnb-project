import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { addReview, fetchSpotReviews } from "../../store/reviews";
import StarRatingInput from "../StarRatingInput";

export default function PostReviewModal({ userReview, spotId }) {
  const [review, setReview] = useState(userReview?.review);
  const [stars, setStars] = useState(userReview?.stars);
  const [errors, setErrors] = useState({});
  const [backEndErrors, setBackEndErrors] = useState({});

  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackEndErrors({});

    const errorHandle = {};

    if (review.length <= 9) {
      errorHandle.review = "Review needs at least 10 characters";
    } else if (review.length > 500) {
      errorHandle.review = "Please limit your review to 500 characters"
    }
    if (stars <= 0) errorHandle.stars = "Please enter a rating of 1 - 5";

    setErrors(errorHandle);

    userReview = {
      ...userReview,
      review,
      stars,
    };

    if (!Object.keys(errorHandle).length) {
      setErrors({});

      return dispatch(addReview(userReview, spotId))
        .then(() => {
          closeModal();
          dispatch(fetchSpotReviews(spotId));
        })
        .catch((error) => error.json())
        .then((res) => res.message)
        .then((res) => setBackEndErrors({ postErr: res }));
    }
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <div className="review-form">
      <h1>How was your stay?</h1>
      <div className="errors">{errors.review || backEndErrors.postErr}</div>
      <form onSubmit={handleSubmit} className="form">
        <textarea
          className="review-field"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="errors">{errors.stars}</div>
        <div className="star-rating">
          <StarRatingInput
            disabled={false}
            onChange={onChange}
            rating={stars}
          />
          Stars
        </div>
        <div className="review-submit-button">
          <button
            className={
              review.length <= 9 || stars <= 0
                ? "disabled-review"
                : "submit-review"
            }
            disabled={review.length <= 9 || stars <= 0}
            type="submit"
          >
            Submit Your Review
          </button>
        </div>
      </form>
    </div>
  );
}
