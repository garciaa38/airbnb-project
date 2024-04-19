import SpotRating from "../SpotRating";
import ReviewItem from "../ReviewItem";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateReviewForm from "../CreateReviewForm";
import "./ReviewsIndex.css";
// import { useSelector } from "react-redux";
// import { selectAllReviews } from "../../store/reviews";

export default function ReviewsIndex({
  avgStarRating,
  reviews,
  spotId,
  numReviews,
  disableReviewButton,
  userId,
}) {
  const reversedReviews = [...reviews].reverse();


  if (!disableReviewButton && reversedReviews.length <= 0) {
    return (
      <div className="review-list">
      <div className="bottom-rating">
        <SpotRating numReviews={numReviews} avgStarRating={avgStarRating} />
      </div>
      <div className="post-review">
        <OpenModalMenuItem
          itemText="Post Your Review"
          disabled={disableReviewButton}
          modalComponent={<CreateReviewForm spotId={spotId} />}
        />
      </div>
      <p>Be the first to post a review!</p>
    </div>
    )
  } else {
    return (
      <div className="review-list">
        <div className="bottom-rating">
          <SpotRating numReviews={numReviews} avgStarRating={avgStarRating} />
        </div>
        <div className="post-review">
          <OpenModalMenuItem
            itemText="Post Your Review"
            disabled={disableReviewButton}
            modalComponent={<CreateReviewForm spotId={spotId} />}
          />
        </div>
        {reversedReviews.map((review) => {
          return (
            <ReviewItem key={review.id} reviewItem={review} userId={userId} />
          );
        })}
      </div>
    );
  }

}
