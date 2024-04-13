import { useSelector, useDispatch } from "react-redux";
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import SpotsIndexItem from "../SpotsIndexItem/index";
import { selectAllUsers } from "../../store/session";

export default function ManageSpotsIndex() {
    const dispatch = useDispatch();
    const spots = Object.values(useSelector(state => state.spots));
    const users = useSelector(selectAllUsers);
    
    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    if (spots && users[0] !== null) {
        const managedSpots = spots.filter(spot => spot.ownerId === users[0].id)

        if (managedSpots.length <= 0) {
            return (
                <h1>{`No spots yet. Why don't you change that today?`}</h1>
            )
        } else {
            return (
                <div>
                    {managedSpots.map(spot => {
                        return (
                            <SpotsIndexItem
                            spot={spot}
                            key={spot.id}
                            user={true}
                            />
                        )
                    })}
                </div>
            )
        } 
    } else {
        return(
            <h1>{`Need to come up with a way to make sure not logged in users can't access this page...`}</h1>
        )
    }
}