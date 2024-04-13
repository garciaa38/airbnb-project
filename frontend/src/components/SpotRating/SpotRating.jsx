import { FaRegStar } from 'react-icons/fa';

export default function SpotRating({avgStarRating, numReviews}) {
    
    if (!avgStarRating){
        return (
            <div>
               <FaRegStar /> New
            </div>
        )
    }

    return (
        <div className="spot-rating">
            <h4><FaRegStar />{avgStarRating} - {numReviews} reviews</h4>
        </div>
    )
}