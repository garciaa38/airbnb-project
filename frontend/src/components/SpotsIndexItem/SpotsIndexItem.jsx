import { FaRegStar } from 'react-icons/fa';

export default function SpotsIndexItem({spot}) {
    const {previewImage, name, city, state, avgRating, price} = spot;
    return (
        <div>
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
                    <h3><FaRegStar />{avgRating?.toFixed(1) || 'New'}</h3>
                </div>
                <h3>${price} night</h3>
            </div>
        </div>
    )
}