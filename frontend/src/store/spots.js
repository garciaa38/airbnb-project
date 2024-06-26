import { csrfFetch } from './csrf';

export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SPOT = 'spots/LOAD_SPOT'
export const ADD_SPOT = 'spots/ADD_SPOT'
export const REMOVE_SPOT = 'spots/REMOVE_SPOT'
export const CLEAR_SPOT_DETAILS = 'spots/CLEAR_SPOT_DETAILS'

//ACTION CREATORS
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const loadOneSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
})

export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
})

export const clearSpotDetails = () => ({
    type: CLEAR_SPOT_DETAILS,
})

/** THUNK ACTION CREATORS **/

//FETCH ALL SPOTS
export const fetchSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots));
    }
}

//FETCH SPOT BY ID
export const spotDetails = (spotId) => async dispatch => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}`);
    
        if (res.ok) {
            const spot = await res.json();
            dispatch(loadOneSpot(spot));
        } else {
            throw new Error('No spot details here')
        }
    } catch (error) {
        console.error("Error fetching spot details:", error)
    }
}

//CREATE A SPOT
export const addSpot = (spot) => async dispatch => {
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    if (res.ok) {
        const newSpot = await res.json();
        dispatch(loadOneSpot(newSpot))
        return newSpot.id
    } else {
        console.error("Please complete spot form!")
    }
}

//UPDATE A SPOT
export const updateSpot = (spot, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(loadOneSpot(updatedSpot))
    } else {
        console.error("Please complete edit spot form!")
    }
}

//DELETE A SPOT
export const deleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })

    if (res.ok) {
        dispatch(removeSpot(spotId))
    }
}

/** REDUCERS **/
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const spotsState = {};
            action.spots.Spots.forEach((spot) => {
                spotsState[spot.id] = spot;
            });
            return spotsState;
        }

        case LOAD_SPOT: {
            return { ...state, [action.spot.id]: action.spot};
        }

        case REMOVE_SPOT: {
            const newState = {...state};
            delete newState[action.spotId];
            return newState;
        }

        case CLEAR_SPOT_DETAILS: {
            return {};
        }

        default:
            return state;
    }
};

export default spotsReducer;