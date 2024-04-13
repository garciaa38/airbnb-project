import { spotDetails } from "../../store/spots";
import { fetchSpotReviews } from "../../store/reviews";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import ReviewsIndex from '../ReviewsIndex/index';
import SpotRating from '../SpotRating/index';
import { selectAllReviews } from "../../store/reviews";
import { selectAllUsers } from '../../store/session';
import './SpotDetails.css'


export default function SpotDetails() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId])
    const reviews = Object.values(useSelector(state => state.reviews))
    const allReviews = useSelector(selectAllReviews);
    const users = useSelector(selectAllUsers);

    const numReviews = allReviews.length;

    const totalRating = allReviews.reduce((total, review) => total + review.stars, 0);

    const avgRating = Math.round((totalRating / numReviews) * 10) / 10;

    console.log(totalRating)
    
    console.log('AVG RATING', avgRating)

    console.log('ALL REVIEWS', allReviews);

    console.log('USERS', users)
    
    useEffect(() => {
        dispatch(spotDetails(spotId))
        dispatch(fetchSpotReviews(spotId))
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

    const disableReviewButton = () => {
        const userReviewedSpot = allReviews.find(rev => rev.userId === users[0]?.id);
        const userOwnsSpot = spot.Owner.id === users[0]?.id;

        if (!users[0]) return true;
        if (userReviewedSpot || userOwnsSpot) return true;

        return false;
    }

    // console.log('IS THE USER DISABLED?', disableReviewButton())
        
    //console.log('SPOT IMAGES FROM STATE', spotImages);
    console.log('SPOT IMAGES FROM SPOT', SpotImages);
    console.log(Owner)

    let counter = 0;

    return (
        <>
        <div className="spot-details">
            <h1>{name}</h1>
            <h2>{city}, {state}, {country}</h2>
            <div className="spot-images">
            {SpotImages?.map(image => {
                console.log('MAPPED IMAGE', image)
                counter++;
                console.log(counter)
                return (
                    <img
                    key={image.id}
                    className={`pos${counter}`}
                    src={image.url}
                    alt={`${name}'s image`}
                    />
                )
            })}
            </div>
            <div className="spot-desc-and-rating">
                <div className="spot-host">
                    <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
                    <p>{description}</p>
                </div>
                <div className="spot-reserve">
                    <div className="spot-reserve-top">
                        <h4>${price} night</h4>
                        <SpotRating 
                        avgStarRating={avgRating} 
                        numReviews={numReviews}
                        />
                    </div>
                    <div className="reserve">
                        <button>Reserve</button>
                    </div>
                </div>
            </div>
        </div>
            <ReviewsIndex 
            reviews={reviews} 
            avgStarRating={avgRating} 
            spotId={spotId} 
            numReviews={numReviews}
            disableReviewButton={disableReviewButton()}
            userId={users[0]?.id}
            />
            </>
    )
}