import { csrfFetch } from './csrf';

export const LOAD_IMAGES = 'spotImages/LOAD_IMAGES'
export const ADD_SPOT_IMAGE = 'spotImages/ADD_SPOT_IMAGES'

//ACTION CREATORS
export const loadSpotImages = (spotImage) => ({
    type: LOAD_IMAGES,
    spotImage
})

export const addSpotImage = (spotImage) => ({
    type: ADD_SPOT_IMAGE,
    spotImage
})

/** THUNK ACTION CREATORS **/

//FETCH SPOT IMAGES
export const fetchSpotImages = (spotId) => async dispatch => {
    const res = await csrfFetch(`api/spots/${spotId}/images`);

    if (res.ok) {
        const spotImages = await res.json();
        dispatch(loadSpotImages(spotImages));
    }
}

//ADD SPOT IMAGE
export const addImage = (spotId, spotImage) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spotImage)
    })


    if (res.ok) {
        const newSpotImage = await res.json();
        dispatch(addSpotImage(newSpotImage))
    }
}

/** REDUCER **/
const spotImagesReducer = (state = {}, action) => {
    switch (action.type) {

        case LOAD_IMAGES: {
            const spotImagesState = {};
            action.spotImages.SpotImages.forEach((spotImage) => {
                spotImagesState[spotImage.id] = spotImage;
            });
            return spotImagesState;
        }

        case ADD_SPOT_IMAGE: {
            return { ...state, [action.spotImage.id]: action.spotImage};
        }

        default:
            return state;
    }
}

export default spotImagesReducer;
