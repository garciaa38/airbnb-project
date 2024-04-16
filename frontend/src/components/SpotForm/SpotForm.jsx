import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSpot, updateSpot } from '../../store/spots';
import { addImage, fetchSpotImages } from '../../store/spotImages';
import './SpotForm.css'

export default function SpotForm({spot, formType}) {
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
    const oldSpotImages = Object.values(useSelector(state=>state.spotImages)).sort((a,b) => a.id - b.id)
    const dispatch = useDispatch();
    if (spotImages) {
        for (let i = 0; i < spotImages.length; i++) {
            spotImages[i].tempId = i;
        }
    }

    useEffect(() => {
        dispatch(fetchSpotImages(spot?.id))
    }, [dispatch, spot?.id])

    console.log("CHECKING OLD IMAGES", oldSpotImages)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorHandle = {};

        if (country === "") errorHandle.country = "Country is required"
        if (address === "") errorHandle.address = "Address is required"
        if (city === "") errorHandle.city = "City is required"
        if (state === "") errorHandle.state = "State is required"
        if (!latitude) {
            errorHandle.latitude = "Latitude is required"
        } else if (latitude < -90 || latitude > 90) {
            errorHandle.latitude = "Latitude must be within -90 and 90 degrees"
        }
        if (!longitude) {
            errorHandle.longitude = "Longitude is required"
        } else if (longitude < -180 || longitude > 180) {
            errorHandle.longitude = "Longitude must be within -180 and 180 degrees"
        }
        if (description.length < 30) errorHandle.description = "Description needs a minimum of 30 characters"
        if (name === "") errorHandle.name = "Name is required"
        if (price === "") errorHandle.price = "Price is required"
        if (!spotImages['0']?.url || spotImages['0']?.tempId !== 0) errorHandle.previewImage = "Preview image is required"
        const spotImgArr = Object.values(spotImages).sort((a, b) => a.tempId - b.tempId);
        


        if (spotImgArr.length) {
            for (let i = 0; i < spotImgArr.length; i++) {
                const imgKey = spotImgArr[i].tempId
                const img = spotImgArr[i].url
                if (img || img.includes(' ')) {
                    const fileType = img.split('.')[img.split('.').length - 1];
                    if (fileType !== 'png' &&
                    fileType !== 'jpg' &&
                    fileType !== 'jpeg') {
                        errorHandle[`image${imgKey}`] = "Image URL must end in .png, .jpg, or jpeg"
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
            price
        }

        console.log("CREATING SPOT", spot)


        if (!Object.keys(errorHandle).length && formType === "Create Spot") {
            setErrors({});
            const newSpotId = await dispatch(addSpot(spot));
            const dispatchedArr = [];
            spotImgArr.forEach(async spotImage => {
                if (spotImage.url.length) {
                    const dispatchedImg = {
                        url: spotImage.url,
                        preview: spotImage.preview
                    }
                    dispatchedArr.push(dispatchedImg)
                }
            })
            await dispatch(addImage(newSpotId, dispatchedArr))

            navigate(`/spots/${newSpotId}`)
        }

        if (!Object.keys(errorHandle).length && formType === "Update Spot") {
            setErrors({});
            const spotId = spot.id;
            await dispatch(updateSpot(spot, spotId));

            console.log("CHECKING FOR UPDATED IMAGES", spotImgArr)
            const dispatchedArr = [];

            for (let i = 0; i < spotImgArr.length; i++) {
                if (oldSpotImages[i]) {
                    if (oldSpotImages[i].url !== spotImgArr[i].url) {
                        oldSpotImages[i].url = spotImgArr[i].url
                    }

                    if (oldSpotImages[i].preview !== spotImgArr[i].preview) {
                        oldSpotImages[i].preview = spotImgArr[i].preview
                    }

                    const dispatchedImg = {
                        id: oldSpotImages[i].id,
                        url: oldSpotImages[i].url,
                        preview: oldSpotImages[i].preview
                    }
                    dispatchedArr.push(dispatchedImg)
                } else {
                    if (spotImgArr[i].url.length) {
                        const dispatchedImg = {
                            url: spotImgArr[i].url,
                            preview: spotImgArr[i].preview
                        }
                        dispatchedArr.push(dispatchedImg)
                    }
                }

            await dispatch(addImage(spotId, dispatchedArr))

            navigate(`/spots/${spotId}`)
            }
        }


    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>{formType}</h2>
            <label>
                Country
                <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                />
            </label><div className='errors'>{errors.country}</div>
            <label>
                Street Address
                <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </label><div className='errors'>{errors.address}</div>
            <label>
                City
                <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </label><div className='errors'>{errors.city}</div>
            <label>
                State
                <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label><div className='errors'>{errors.state}</div>
            <label>
                Latitude
                <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                />
            </label><div className='errors'>{errors.latitude}</div>
            <label>
                Longitude
                <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                />
            </label><div className='errors'>{errors.longitude}</div>
            <label>
                Description
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <div className='errors'>{errors.description}</div>
            <label>
                Name
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </label>
            <div className='errors'>{errors.name}</div>
            <label>
                Price
                <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            <div className='errors'>{errors.price}</div>
            <label>
                Photos
                <input
                type="text"
                value={spotImages && spotImages['0']?.url}
                onChange={(e) => setSpotImages({...spotImages,
                    '0': {
                    url: e.target.value,
                    preview: true,
                    tempId: 0
                }})}
                />
                <div className='errors'>{errors.previewImage}</div>
                <div className='errors'>{errors[`image0`]}</div>
                <input
                type="text"
                value={spotImages && spotImages['1']?.url}
                onChange={(e) => setSpotImages({...spotImages,
                    '1': {
                    url: e.target.value,
                    preview: false,
                    tempId: 1
                }})}
                />
                <div className='errors'>{errors[`image1`]}</div>
                <input
                type="text"
                value={spotImages && spotImages['2']?.url}
                onChange={(e) => setSpotImages({...spotImages,
                    '2': {
                    url: e.target.value,
                    preview: false,
                    tempId: 2
                }})}
                />
                <div className='errors'>{errors[`image2`]}</div>
                <input
                type="text"
                value={spotImages && spotImages['3']?.url}
                onChange={(e) => setSpotImages({...spotImages,
                    '3': {
                    url: e.target.value,
                    preview: false,
                    tempId: 3
                }})}
                />
                <div className='errors'>{errors[`image3`]}</div>
                <input
                type="text"
                value={spotImages && spotImages['4']?.url}
                onChange={(e) => setSpotImages({...spotImages,
                    '4': {
                    url: e.target.value,
                    preview: false,
                    tempId: 4
                }})}
                />
                <div className='errors'>{errors[`image4`]}</div>
            </label>
            <button type="submit">{formType}</button>
        </form> 
    )
}