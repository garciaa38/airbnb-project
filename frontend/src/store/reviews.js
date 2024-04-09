export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'

//ACTION CREATORS
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});

/** THUNK ACTION CREATORS **/

//FETCH SPOT REVIEWS
export const fetchSpotReviews = (spotId) => async dispatch => {
    const res = await fetch(`/api/spots/${Number(spotId)}/reviews`);

    if (res.ok) {
        const reviews = await res.json();
        dispatch(loadReviews(reviews));
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

        default:
            return state;
    }
};

export default reviewsReducer;
