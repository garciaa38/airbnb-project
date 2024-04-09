import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import SpotsIndexItem from '../SpotsIndexItem/SpotsIndexItem';

export default function SpotsIndex() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    console.log("FETCHED SPOTS", spots)
    console.log("SPOT 2", spots[2])


    return (
        <div>
            {spots.map(spot => {
            return (
                <SpotsIndexItem
                spot={spot}
                key={spot.id}
                />
                )
            })}
        </div>
    )
}