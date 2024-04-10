import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { spotDetails } from '../../store/spots';
import SpotForm from "../SpotForm";

export default function UpdateSpotForm() {
    const { spotId } = useParams();
    const spot = useSelector(state=>state.spots[`${spotId}`]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(spotDetails(spotId))
    }, [dispatch, spotId])

    if (!spot) return(<></>);

    console.log(spot)
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