import SpotRating from "../SpotRating";
import ReviewItem from "../ReviewItem";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReviewForm from '../CreateReviewForm';
import './ReviewsIndex.css'
// import { useSelector } from "react-redux";
// import { selectAllReviews } from "../../store/reviews";

export default function ReviewsIndex({avgStarRating, reviews, spotId, numReviews, disableReviewButton}) {
    //console.log('IS THE USER DISABLED HERE?', disableReviewButton)
    return (
        <div>
            <SpotRating numReviews={numReviews} avgStarRating={avgStarRating}/>
            <OpenModalMenuItem
            itemText="Post Your Review"
            disabled={disableReviewButton}
            modalComponent={<CreateReviewForm spotId={spotId}/>}
            />
            {reviews.map(review => {
                return (
                    <ReviewItem key={review.id} reviewItem={review}/>
                )
            })}
        </div>
        
    )
}