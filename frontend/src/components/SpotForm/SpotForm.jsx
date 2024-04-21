import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addSpot, updateSpot } from "../../store/spots";
import { addImage, fetchSpotImages } from "../../store/spotImages";
import "./SpotForm.css";

export default function SpotForm({ spot, formType }) {
  const navigate = useNavigate();

  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [latitude, setLatitude] = useState(spot?.lat);
  const [longitude, setLongitude] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price);
  const [spotImages, setSpotImages] = useState(spot?.SpotImages);
  const [errors, setErrors] = useState({});
  const oldSpotImages = Object.values(
    useSelector((state) => state.spotImages)
  ).sort((a, b) => a.id - b.id);
  const dispatch = useDispatch();
  if (spotImages) {
    for (let i = 0; i < spotImages.length; i++) {
      spotImages[i].tempId = i;
    }
  }

  useEffect(() => {
    dispatch(fetchSpotImages(spot?.id));
  }, [dispatch, spot?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const errorHandle = {};

    if (country === "") errorHandle.country = "Country is required";

    if (address === "") errorHandle.address = "Address is required";

    if (city === "") errorHandle.city = "City is required";

    if (state === "") errorHandle.state = "State is required";

    if (!latitude) {
      errorHandle.latitude = "Latitude is required";
    } else if (latitude < -90 || latitude > 90) {
      errorHandle.latitude = "Latitude must be within -90 and 90 degrees";
    }

    if (!longitude) {
      errorHandle.longitude = "Longitude is required";
    } else if (longitude < -180 || longitude > 180) {
      errorHandle.longitude = "Longitude must be within -180 and 180 degrees";
    }

    if (description.length < 30)
      errorHandle.description = "Description needs a minimum of 30 characters";

    if (name === "") errorHandle.name = "Name is required";

    if (price === "") {
      errorHandle.price = "Price is required";
    } else if (isNaN(Number(price))) {
      errorHandle.price = "Please include a valid price";
    } else if (Number(price) <= 0) {
      errorHandle.price = "Price is required";
    } else if (price.toString().split(".")[1]?.length > 2) {
      const fixedPrice = parseFloat(Number(price)).toFixed(2);
      setPrice(fixedPrice);
    }

    if (!spotImages["0"]?.url || spotImages["0"]?.tempId !== 0)
      errorHandle.previewImage = "Preview image is required";
    const spotImgArr = Object.values(spotImages).sort(
      (a, b) => a.tempId - b.tempId
    );

    if (spotImgArr.length) {
      for (let i = 0; i < spotImgArr.length; i++) {
        const imgKey = spotImgArr[i].tempId;
        const img = spotImgArr[i].url;
        if (img || img.includes(" ")) {
          const fileType = img.split(".")[img.split(".").length - 1];
          if (fileType !== "png" && fileType !== "jpg" && fileType !== "jpeg") {
            errorHandle[`image${imgKey}`] =
              "Image URL must end in .png, .jpg, or jpeg";
          }
        }
      }
    }

    setErrors(errorHandle);

    spot = {
      ...spot,
      country,
      address,
      city,
      state,
      lat: latitude,
      lng: longitude,
      description,
      name,
      price,
    };

    if (!Object.keys(errorHandle).length && formType === "Create Spot") {
      setErrors({});
      const newSpotId = await dispatch(addSpot(spot));
      const dispatchedArr = [];
      spotImgArr.forEach(async (spotImage) => {
        if (spotImage.url.length) {
          const dispatchedImg = {
            url: spotImage.url,
            preview: spotImage.preview,
          };
          dispatchedArr.push(dispatchedImg);
        }
      });
      await dispatch(addImage(newSpotId, dispatchedArr));

      navigate(`/spots/${newSpotId}`);
    }

    if (!Object.keys(errorHandle).length && formType === "Update Spot") {
      setErrors({});
      const spotId = spot.id;
      await dispatch(updateSpot(spot, spotId));

      const dispatchedArr = [];

      for (let i = 0; i < spotImgArr.length; i++) {
        if (oldSpotImages[i]) {
          if (oldSpotImages[i].url !== spotImgArr[i].url) {
            oldSpotImages[i].url = spotImgArr[i].url;
          }

          if (oldSpotImages[i].preview !== spotImgArr[i].preview) {
            oldSpotImages[i].preview = spotImgArr[i].preview;
          }

          const dispatchedImg = {
            id: oldSpotImages[i].id,
            url: oldSpotImages[i].url,
            preview: oldSpotImages[i].preview,
          };
          dispatchedArr.push(dispatchedImg);
        } else {
          if (spotImgArr[i].url.length) {
            const dispatchedImg = {
              url: spotImgArr[i].url,
              preview: spotImgArr[i].preview,
            };
            dispatchedArr.push(dispatchedImg);
          }
        }
      }
      await dispatch(addImage(spotId, dispatchedArr));

      navigate(`/spots/${spotId}`);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>
          {formType === "Create Spot"
            ? "Create a New Spot"
            : "Update your Spot"}
        </h2>
        <div className="location-form">
          <h3>{`Where's your place located?`}</h3>
          <p>{`Guests will only get your exact address once they booked a reservation.`}</p>
          <div className="country">
            <label>Country</label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="errors">{errors.country}</div>
          <div className="address">
            <label>Street Address</label>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="errors">{errors.address}</div>
          <div className="city-state">
            <div className="city">
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="errors">{errors.city}</div>
            </div>
            <div className="city-comma">
              <p>,</p>
            </div>
            <div className="state">
              <label>State</label>
              <input
                type="text"
                placeholder="STATE"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <div className="errors">{errors.state}</div>
            </div>
          </div>
          <div className="lat-and-long">
            <div className="latitude">
              <label>Latitude</label>
              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <div className="errors">{errors.latitude}</div>
            </div>
            <div className="lat-lng-comma">
              <p>,</p>
            </div>
            <div className="longitude">
              <label>Longitude</label>
              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <div className="errors">{errors.longitude}</div>
            </div>
          </div>
        </div>
        <div className="description-form">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <div className="description">
            <textarea
              value={description}
              placeholder="Please write at least 30 characters"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="errors">{errors.description}</div>
        </div>
        <div className="name-form">
          <h3>Create a title for your spot</h3>
          <p>{`Catch guests' attention with a spot title that highlights what makes your place special.`}</p>
          <div className="name">
            <input
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="errors">{errors.name}</div>
        </div>
        <div className="price-form">
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="price">
            <div className="price-field">
              <p>$</p>
              <input
                type="number"
                placeholder="Price per night (USD)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="errors">{errors.price}</div>
        </div>
        <div className="photo-form">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <div className="photos">
            <label>Photos</label>
            <input
              type="text"
              placeholder="Preview Image URL"
              value={spotImages && spotImages["0"]?.url}
              onChange={(e) =>
                setSpotImages({
                  ...spotImages,
                  0: {
                    url: e.target.value,
                    preview: true,
                    tempId: 0,
                  },
                })
              }
            />
            <div className="errors">
              {errors.previewImage || errors[`image0`]}
            </div>
            <input
              type="text"
              placeholder="Image URL"
              value={spotImages && spotImages["1"]?.url}
              onChange={(e) =>
                setSpotImages({
                  ...spotImages,
                  1: {
                    url: e.target.value,
                    preview: false,
                    tempId: 1,
                  },
                })
              }
            />
            <div className="errors">{errors[`image1`]}</div>
            <input
              type="text"
              placeholder="Image URL"
              value={spotImages && spotImages["2"]?.url}
              onChange={(e) =>
                setSpotImages({
                  ...spotImages,
                  2: {
                    url: e.target.value,
                    preview: false,
                    tempId: 2,
                  },
                })
              }
            />
            <div className="errors">{errors[`image2`]}</div>
            <input
              type="text"
              placeholder="Image URL"
              value={spotImages && spotImages["3"]?.url}
              onChange={(e) =>
                setSpotImages({
                  ...spotImages,
                  3: {
                    url: e.target.value,
                    preview: false,
                    tempId: 3,
                  },
                })
              }
            />
            <div className="errors">{errors[`image3`]}</div>
            <input
              type="text"
              placeholder="Image URL"
              value={spotImages && spotImages["4"]?.url}
              onChange={(e) =>
                setSpotImages({
                  ...spotImages,
                  4: {
                    url: e.target.value,
                    preview: false,
                    tempId: 4,
                  },
                })
              }
            />
            <div className="errors">{errors[`image4`]}</div>
          </div>
        </div>
        <div className="form-submit">
          <button type="submit">
            {formType === "Create Spot" ? "Create Spot" : "Update your Spot"}
          </button>
        </div>
      </form>
    </div>
  );
}
