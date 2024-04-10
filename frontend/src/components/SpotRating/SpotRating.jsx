export default function SpotRating({avgStarRating, numReviews}) {
    
    if (!avgStarRating){
        return (
            <div>
                New
            </div>
        )
    }

    return (
        <div>
            <h2>{avgStarRating}</h2>
            <h3>{numReviews}</h3>
        </div>
    )
}