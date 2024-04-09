import SpotRating from "../SpotRating";
import ReviewItem from "../ReviewItem";

export default function ReviewsIndex({avgStarRating, reviews}) {
    console.log('REVIEWS INDEX', reviews);

    const numReviews = reviews.length

    return (
        <div>
            <SpotRating numReviews={numReviews} avgStarRating={avgStarRating}/>
            {reviews.map(review => {
                return (
                    <ReviewItem key={review.id} reviewItem={review}/>
                )
            })}
        </div>
        
    )
}