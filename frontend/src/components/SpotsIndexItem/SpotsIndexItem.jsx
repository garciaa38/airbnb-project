import { FaStar } from "react-icons/fa";
import "./SpotsIndexItem.css";

export default function SpotsIndexItem({ spot }) {
  const { previewImage, name, city, state, avgRating, price } = spot;
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
          <h3>
            {city}, {state}
          </h3>
          <div className="star-icon">
            <h3>
              <FaStar />
            </h3>
            <h3>{avgRating?.toFixed(1) || "New"}</h3>
          </div>
        </div>
        <h3>${parseFloat(Number(price)).toFixed(2)}/night</h3>
      </div>
    </div>
  );
}
