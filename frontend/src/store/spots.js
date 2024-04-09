export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SPOT = 'spots/LOAD_SPOT'

//ACTION CREATORS
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
});

export const loadOneSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
})

/** THUNK ACTION CREATORS **/

//FETCH ALL SPOTS
export const fetchSpots = () => async dispatch => {
    const res = await fetch('/api/spots');

    if (res.ok) {
        const spots = await res.json();
        dispatch(loadSpots(spots));
    }
}

//FETCH SPOT BY ID
export const spotDetails = (spotId) => async dispatch => {
    try {
        const res = await fetch(`/api/spots/${spotId}`);
    
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

        default:
            return state;
    }
};

export default spotsReducer;