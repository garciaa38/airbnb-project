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

    console.log('USERS', users)

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    console.log('NAV',navigate)
    console.log("FETCHED SPOTS", spots)
    console.log("SPOT 2", spots[2])


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