import { csrfFetch } from './csrf';
import { createSelector } from 'reselect';

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
export const LOAD_REVIEW = 'reviews/LOAD_REVIEW'

//ACTION CREATORS
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});

export const loadOneReview = (review) => ({
    type: LOAD_REVIEW,
    review
})

const selectReviews = state => state?.reviews

export const selectAllReviews = createSelector(selectReviews, reviews => {
    return reviews ? Object.values(reviews) : [];
});

/** THUNK ACTION CREATORS **/

//FETCH SPOT REVIEWS
export const fetchSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${Number(spotId)}/reviews`);

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadReviews(reviews));
    }
}

//CREATE REVIEW FOR SPOT
export const addReview = (review, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    })
    
    if (res.ok) {
        const newReview = await res.json();
        dispatch(loadOneReview(newReview))
        return newReview
    }
}

/** REDUCERS **/
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const reviewsState = {};
            action.reviews.Reviews.forEach((review) => {
                reviewsState[review.id] = review;
            });
            return reviewsState;
        }

        case LOAD_REVIEW: {
            return { ...state, [action.review.id]: action.review};
        }

        default:
            return state;
    }
};

export default reviewsReducer;
