import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal";

export default function SpotsIndexItem({spot, user}) {
    const {previewImage, name, city, state, avgRating, price, id} = spot;
    return (
        <div className="spot-tile" title={name}>
            <div>
                <img
                className="preview-image" 
                src={previewImage}
                alt={`${name}'s Preview Image`}
                />
            </div>
            <div className="spot-info">
                <div className="city-and-rating">
                    <h3>{city}, {state}</h3>
                    <h3>{avgRating}</h3>
                </div>
                <h3>${price} night</h3>
            </div>
            {user === true && <button>Update</button>}
            {user === true && <OpenModalMenuItem itemText="Delete" modalComponent={<DeleteSpotModal spotId={id}/>}/>}
        </div>
    )
}