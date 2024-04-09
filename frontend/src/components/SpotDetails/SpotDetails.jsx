import { spotDetails } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import ReviewsIndex from '../ReviewsIndex/index';
import SpotRating from '../SpotRating/index';

export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId])
    const reviews = Object.values(useSelector(state => state.reviews))
    
    useEffect(() => {
        dispatch(spotDetails(spotId))
        dispatch(fetchSpotReviews(spotId))
    }, [dispatch, spotId])

    console.log("SPOT", spot)
    console.log("REVIEWS", reviews)
    console.log("NumReviews", reviews.length)
    
    if (!spot) {
        return (
            <h2>Loading...</h2>
        )
    }
    
    const {
        SpotImages,
        name,
        Owner,
        address,
        avgStarRating,
        city,
        state,
        country,
        description,
        price
    } = spot;

    const numReviews = reviews.length

    console.log("SpotImages", SpotImages)
    console.log("Name", name)
    console.log("Owner", Owner)
    console.log("Address", address)
    console.log("AvgStarRating", avgStarRating)
    console.log("City", city)
    console.log("State", state)
    console.log("Country", country)
    console.log("Description", description)
    console.log("Price", price)



    return (
        <div>
            <h1>{name}</h1>
            <h2>{city}{state}{country}</h2>
            {SpotImages.map(image => {
                return (
                <div key={image.url}>
                    <img
                    src={image.url}
                    alt={`${name}'s image`}
                    />
                </div>
                )
            })}
            <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
            <p>{description}</p>
            <h4>${price} night</h4>
            <SpotRating avgStarRating={avgStarRating} numReviews={numReviews}/>
            <button>Reserve</button>
            <ReviewsIndex reviews={reviews} avgStarRating={avgStarRating}/>
        </div>
    )
}