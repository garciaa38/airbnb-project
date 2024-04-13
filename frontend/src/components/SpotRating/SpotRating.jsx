export default function SpotRating({avgStarRating, numReviews}) {
    
    if (!avgStarRating){
        return (
            <div>
                New
            </div>
        )
    }

    return (
        <div className="spot-rating">
            <h4>{avgStarRating} - {numReviews} reviews</h4>
        </div>
    )
}