import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots, clearSpotDetails } from '../../store/spots';
import { useEffect } from 'react';
import SpotsIndexItem from '../SpotsIndexItem/SpotsIndexItem';
import { Link } from 'react-router-dom'
import './SpotsIndex.css'

export default function SpotsIndex() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));

    useEffect(() => {
        dispatch(fetchSpots());

        return () => {
            dispatch(clearSpotDetails());
        }
    }, [dispatch]);

    return (
        <div className="spot-grid">
            {spots.map(spot => {
            return (
                <div className="spot-tile" title={spot.name} key={spot.id}>
                <Link to={`/spots/${spot.id}`} key={spot.id}>
                    <SpotsIndexItem spot={spot} key={spot.id}/>
                </Link>
                </div>
                )
            })}
        </div>
    )
}