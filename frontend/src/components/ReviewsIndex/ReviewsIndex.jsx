import SpotRating from "../SpotRating";
import ReviewItem from "../ReviewItem";
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReviewForm from '../CreateReviewForm';
// import { useSelector } from "react-redux";
// import { selectAllReviews } from "../../store/reviews";

export default function ReviewsIndex({avgStarRating, reviews, spotId, numReviews}) {
    
    return (
        <div>
            <SpotRating numReviews={numReviews} avgStarRating={avgStarRating}/>
            <OpenModalMenuItem
            itemText="Post Your Review"
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