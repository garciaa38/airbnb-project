import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { addReview, fetchSpotReviews } from '../../store/reviews';
import StarRatingInput from '../StarRatingInput';

export default function PostReviewModal({userReview, formType, spotId, onSubmit}) {
    const [review, setReview] = useState(userReview?.review);
    const [stars, setStars] = useState(userReview?.stars);
    const [errors, setErrors] = useState({});
    const [backEndErrors, setBackEndErrors] = useState({})
    
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorHandle = {};

        userReview = {
            ...userReview,
            review,
            stars,
        }

        if (!Object.keys(errorHandle).length) {
            setErrors({});
            
            return dispatch(addReview(userReview, spotId))
            .then(() => {
                closeModal();
                dispatch(fetchSpotReviews(spotId));
            })
            .catch((error) => error.json())
            .then(res => res.message)
            .then(res => setBackEndErrors({postErr: res}))
        }
    }

    const onChange = (number) => {
        setStars(parseInt(number))
    }

    return (
        <>
          <h1>How was your stay?</h1>
          <div className='errors'>{backEndErrors.postErr}</div>
          <form onSubmit={handleSubmit}>
            <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            />
            <StarRatingInput 
            disabled={false}
            onChange={onChange}
            rating={stars}
            />
            <button type="submit">Submit Your Review</button>
          </form>
        </>
    )
}