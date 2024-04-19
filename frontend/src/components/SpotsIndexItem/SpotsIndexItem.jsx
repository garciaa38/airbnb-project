import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import "./SpotsIndexItem.css";

export default function SpotsIndexItem({ spot }) {
  const { previewImage, name, city, state, avgRating, price } = spot;
  
  const [isValidImage, setIsValidImage] = useState(null);

  const checkImage = (url) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function() {
        resolve(true);
      };
      image.onerror = function() {
        resolve(false);
      };
      image.src = url;
    });
  };

  useEffect(() => {
    checkImage(previewImage).then((isValid) => {
      setIsValidImage(isValid)
    });
  }, [previewImage]);

  // const checkImage = (url) => {
  //   console.log("WHAT IS THIS URL?", url)
  //   let image = new Image();
  //   image.src = url;
  //   image.onload = function() {
  //     if (this.width > 0) {
  //       return true;
  //     } else {
  //       return false
  //     }
  //   }
  //   if (image.onload(url)) {
  //     return true;
  //   }
  
  // }

  return (
    <div className="tile">
      <div className="aspect-ratio-box">

        {isValidImage ? (
          <img
          className="preview-image"
          src={previewImage}
          alt={`${name}'s Preview Image`}
          />
        ) : (
          <img
            className="preview-image"
            src={'/landing-pad-icon-black.png'}
            alt={`${name}'s Preview Image`}
          />
        )}

      {/* {
      checkImage(previewImage) === true &&
      <img
      className="preview-image"
      src={previewImage}
      alt={`${name}'s Preview Image`}
      />
      }
      {
      !checkImage(previewImage) &&
      <img
      className="preview-image"
      src={'/landing-pad-icon-black.png'}
      alt={`${name}'s Preview Image`}
      />
      } */}

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
