import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import SpotsIndexItem from '../SpotsIndexItem/SpotsIndexItem';
import { selectAllUsers } from '../../store/session';
import { Link } from 'react-router-dom'

export default function SpotsIndex({navigate}) {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));
    const users = useSelector(selectAllUsers);


    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    return (
        <div className="spot-grid">
            {spots.map(spot => {
            return (
                <Link to={`/spots/${spot.id}`} key={spot.id}>
                    <SpotsIndexItem spot={spot}/>
                </Link>
                )
            })}
        </div>
    )
}