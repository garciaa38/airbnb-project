import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

export const LOAD_IMAGES = "spotImages/LOAD_IMAGES";
export const ADD_SPOT_IMAGE = "spotImages/ADD_SPOT_IMAGES";
export const REMOVE_SPOT_IMAGE = "spotImages/REMOVE_SPOT_IMAGE";
export const CLEAR_SPOT_IMAGES = "spotImages/CLEAR_SPOT_IMAGES";

//ACTION CREATORS
export const loadSpotImages = (spotImages) => ({
  type: LOAD_IMAGES,
  spotImages,
});

export const addSpotImage = (spotImage) => ({
  type: ADD_SPOT_IMAGE,
  spotImage,
});

export const removeSpotImage = (spotImageId) => ({
    type: REMOVE_SPOT_IMAGE,
    spotImageId
});

export const clearSpotImgDetails = () => ({
  type: CLEAR_SPOT_IMAGES,
});

const selectSpotImages = (state) => state.spotImages;

export const grabSpotImages = createSelector(selectSpotImages, (spotImages) => {
  return spotImages ? Object.values(spotImages) : [];
});

/** THUNK ACTION CREATORS **/

//FETCH SPOT IMAGES
export const fetchSpotImages = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const spotImages = await res.json();
    dispatch(loadSpotImages(spotImages.SpotImages));
  }
};

//ADD SPOT IMAGE
export const addImage = (spotId, spotImageArr) => async (dispatch) => {
  for (const spotImage of spotImageArr) {
    try {
      if (spotImage.id && spotImage.url === "") {
        const res = await csrfFetch(`/api/spot-images/${spotImage.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spotImage),
        });

        if (res.ok) {
          dispatch(removeSpotImage(spotImage.id));
        }
      } else if (spotImage.id) {
        const res = await csrfFetch(`/api/spot-images/${spotImage.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spotImage),
        });

        if (res.ok) {
          const updatedSpotImage = await res.json();
          dispatch(addSpotImage(updatedSpotImage));
        }
      } else {
        const res = await csrfFetch(`/api/spots/${spotId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spotImage),
        });

        if (res.ok) {
          const newSpotImage = await res.json();
          dispatch(addSpotImage(newSpotImage));
        }
      }

      // if (spotImage.id) {
      //     const res = await csrfFetch(`/api/spot-images/${spotImage.id}`, {
      //         method: 'PUT',
      //         headers: {'Content-Type': 'application/json'},
      //         body: JSON.stringify(spotImage)
      //     });

      //     if (res.ok) {
      //         const updatedSpotImage = await res.json();
      //         dispatch(addSpotImage(updatedSpotImage))
      //     }
      // } else {
      //     const res = await csrfFetch(`/api/spots/${spotId}/images`, {
      //         method: 'POST',
      //         headers: {'Content-Type': 'application/json'},
      //         body: JSON.stringify(spotImage)
      //     });

      //     if (res.ok) {
      //         const newSpotImage = await res.json();
      //         dispatch(addSpotImage(newSpotImage))
      //     }
      // }
    } catch (error) {
      console.error("Error adding image:", error);
    }
  }
};

/** REDUCER **/
const spotImagesReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_IMAGES: {
      const spotImagesState = {};
      action.spotImages.forEach((spotImage) => {
        spotImagesState[spotImage.id] = spotImage;
      });
      return spotImagesState;
    }

    case ADD_SPOT_IMAGE: {
      return { ...state, [action.spotImage.id]: action.spotImage };
    }

    case REMOVE_SPOT_IMAGE: {
        const newState = {...state};
        delete newState[action.spotImageId];
        return newState;
    }

    case CLEAR_SPOT_IMAGES: {
      return {};
    }

    default:
      return state;
  }
};

export default spotImagesReducer;
