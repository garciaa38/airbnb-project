import { FaRegStar } from 'react-icons/fa';

export default function SpotRating({avgStarRating, numReviews}) {
    
    if (!avgStarRating){
        return (
            <div>
               <FaRegStar /> New
            </div>
        )
    }

    if (numReviews === 1) {
        return (
        <div className="spot-rating">
            <h4><FaRegStar />{avgStarRating.toFixed(1)} - {numReviews} review</h4>
        </div>
        )
    }

    return (
        <div className="spot-rating">
            <h4><FaRegStar />{avgStarRating.toFixed(1)} - {numReviews} reviews</h4>
        </div>
    )
}