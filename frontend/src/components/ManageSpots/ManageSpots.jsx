import { useSelector, useDispatch } from "react-redux";
import { fetchSpots, clearSpotDetails } from "../../store/spots";
import { useEffect } from "react";
import SpotsIndexItem from "../SpotsIndexItem/index";
import { selectAllUsers } from "../../store/session";
import { Link } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal";
import "./ManageSpots.css";

export default function ManageSpotsIndex() {
  const dispatch = useDispatch();
  const spots = Object.values(useSelector((state) => state.spots));
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(fetchSpots());

    return () => {
      dispatch(clearSpotDetails());
    };
  }, [dispatch]);

  if (spots && users[0] !== null) {
    const managedSpots = spots.filter((spot) => spot.ownerId === users[0].id);

    if (managedSpots.length <= 0) {
      return (
        <div className="manage-spots-index">
          <h1>Manage Your Spots</h1>
          <Link to={`/spots/new`}>Create a New spot</Link>
          <h2>{`No spots yet. Why don't you change that today?`}</h2>
        </div>
      );
    } else {
      return (
        <div className="manage-spots-index">
          <div className="manage-header">
            <h1>Manage Your Spots</h1>
            <div className="make-more-spots">
              <Link className="make-more-spots-btn" to={`/spots/new`}>Create a New Spot</Link>
            </div>
          </div>
          <div className="spot-grid">
            {managedSpots.map((spot) => {
              return (
                <>
                  <div className="spot-tile" title={spot.name} key={spot.id}>
                    <Link to={`/spots/${spot.id}`}>
                      <SpotsIndexItem spot={spot} user={true} />
                    </Link>
                    <div className="update-delete">
                      <Link
                        className="update-btn"
                        to={`/spots/${spot.id}/edit`}
                      >
                        Update
                      </Link>
                      <div className="delete-btn">
                        <OpenModalMenuItem
                          itemText="Delete"
                          modalComponent={<DeleteSpotModal spotId={spot.id} />}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      );
    }
  } else {
    return (
      <>
        <h1>Manage Your Spots</h1>
        <Link to={`/spots/new`}>Create a New spot</Link>
        <h2>{`Need to come up with a way to make sure not logged in users can't access this page...`}</h2>
      </>
    );
  }
}
