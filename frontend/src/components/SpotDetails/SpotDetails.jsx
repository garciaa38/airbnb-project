import { spotDetails } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
//import { fetchSpotImages } from "../../store/spotImages";
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
    //const spotImages = Object.values(useSelector(state => state.spotImages))
    
    useEffect(() => {
        dispatch(spotDetails(spotId))
        dispatch(fetchSpotReviews(spotId))
        //dispatch(fetchSpotImages(spotId))
    }, [dispatch, spotId])
    
    
    if (!spot) {
        return (
            <h2>Loading...</h2>
            )
        }

        const {
            SpotImages,
            name,
            Owner,
            avgStarRating,
            city,
            state,
            country,
            description,
            price
        } = spot;

    if (!Owner || !SpotImages) {
        return (
            <h2>Loading...</h2>
        )
    }
        
    //console.log('SPOT IMAGES FROM STATE', spotImages);
    console.log('SPOT IMAGES FROM SPOT', SpotImages);
    console.log(Owner)

    const numReviews = reviews.length

    return (
        <div>
            <h1>{name}</h1>
            <h2>{city}{state}{country}</h2>
            {SpotImages?.slice().reverse().map(image => {
                console.log('MAPPED IMAGE', image)
                return (
                <div key={image.id}>
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