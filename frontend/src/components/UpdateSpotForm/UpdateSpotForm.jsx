import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { spotDetails, clearSpotDetails } from '../../store/spots';
import { clearSpotImgDetails, fetchSpotImages } from '../../store/spotImages';
import SpotForm from "../SpotForm";

export default function UpdateSpotForm() {
    const { spotId } = useParams();
    const spot = useSelector(state=>state.spots[`${spotId}`]);
    const SpotImages = Object.values(useSelector(state=>state.spotImages));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotDetails(spotId))
        dispatch(fetchSpotImages(spotId))

        return () => {
            dispatch(clearSpotDetails());
            dispatch(clearSpotImgDetails())
        }
    }, [dispatch, spotId])

    if (!spot || SpotImages.length <= 0) return(<></>);


    spot.SpotImages = SpotImages;
    
    return (
        Object.keys(spot).length > 1 && (
            <>
              <SpotForm 
              spot={spot}
              formType="Update Spot"
              />
            </>
        )
    );
}