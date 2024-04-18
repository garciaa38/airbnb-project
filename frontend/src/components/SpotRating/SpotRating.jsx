import { FaStar } from 'react-icons/fa';

export default function SpotRating({avgStarRating, numReviews}) {
    
    if (!avgStarRating){
        return (
            <div className="spot-rating">
               <h4>
                <FaStar /> New
                </h4>
            </div>
        )
    }

    if (numReviews === 1) {
        return (
        <div className="spot-rating">
            <h4><FaStar />{avgStarRating.toFixed(1)} · {numReviews} review</h4>
        </div>
        )
    }

    return (
        <div className="spot-rating">
            <h4><FaStar />{avgStarRating.toFixed(1)} · {numReviews} reviews</h4>
        </div>
    )
}