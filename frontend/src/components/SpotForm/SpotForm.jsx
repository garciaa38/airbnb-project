import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSpot } from '../../store/spots';
import { addImage } from '../../store/spotImages';
import './SpotForm.css'

export default function SpotForm({spot, formType}) {
    const navigate = useNavigate();

    const [country, setCountry] = useState(spot?.country);
    const [address, setAddress] = useState(spot?.address);
    const [city, setCity] = useState(spot?.city);
    const [state, setState] = useState(spot?.state);
    const [latitude, setLatitude] = useState(spot?.latitude);
    const [longitude, setLongitude] = useState(spot?.longitude);
    const [description, setDescription] = useState(spot?.description);
    const [name, setName] = useState(spot?.name);
    const [price, setPrice] = useState(spot?.price);
    const [spotImages, setSpotImages] = useState(spot?.SpotImages);
    const [spotImageLinks, setSpotImageLinks] = useState({})
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        setSpotImages(Object.values(spotImageLinks));
    }, [spotImageLinks])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('SPOT IMAGE LINKS', spotImageLinks);
        // console.log(Object.values(spotImageLinks))

        const errorHandle = {};

        if (country === "") errorHandle.country = "Country is required"
        if (address === "") errorHandle.address = "Address is required"
        if (city === "") errorHandle.city = "City is required"
        if (state === "") errorHandle.state = "State is required"
        if (latitude === "") errorHandle.latitude = "Latitude is required"
        if (longitude === "") errorHandle.longitude = "Longitude is required"
        if (description.length < 30) errorHandle.description = "Description needs a minimum of 30 characters"
        if (name === "") errorHandle.name = "Name is required"
        if (price === "") errorHandle.price = "Price is required"
        if (!spotImages[0]?.url || spotImages[0]?.id !== '0') errorHandle.previewImage = "Preview image is required"
        console.log("ARRAY OF SPOT IMAGES BEFORE LOOP", spotImages)
        if (spotImages.length) {
            for (let i = 0; i < spotImages.length; i++) {
                const imgKey = spotImages[i].id
                console.log('IMAGE KEY', imgKey)
                const img = spotImages[i].url
                if (img || img.includes(' ')) {
                    const fileType = img.split('.')[img.split('.').length - 1];
                    if (fileType !== 'png' &&
                    fileType !== 'jpg' &&
                    fileType !== 'jpeg') {
                        errorHandle[`image${imgKey}`] = "Image URL must end in .png, .jpg, or jpeg"
                        console.log(errorHandle)
                    }
                }
            }
        }
        console.log("ARRAY OF SPOT IMAGES AFTER LOOP", spotImages)

        console.log('OBJECT OF ERRORS', errorHandle)
        setErrors(errorHandle);

        spot = {
            ...spot,
            country,
            address,
            city,
            state,
            latitude,
            longitude,
            description,
            name,
            price
        }


        if (!Object.keys(errorHandle).length) {
            setErrors({});
            const newSpotId = await dispatch(addSpot(spot));

            spotImages.forEach(async spotImage => {
                if (spotImage.url.length) {
                    const dispatchedImg = {
                        url: spotImage.url,
                        preview: spotImage.preview
                    }
                    console.log('DISPATCHED IMAGE', dispatchedImg)
                    await dispatch(addImage(newSpotId, dispatchedImg))
                }
            })

            navigate(`/spots/${newSpotId}`)
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
                value={spotImageLinks['0']?.url || ''}
                onChange={(e) => setSpotImageLinks({...spotImageLinks,
                    '0': {
                    url: e.target.value,
                    preview: true,
                    id: '0'
                }})}
                />
                <div className='errors'>{errors.previewImage}</div>
                <div className='errors'>{errors[`image0`]}</div>
                <input
                type="text"
                value={spotImageLinks['1']?.url || ''}
                onChange={(e) => setSpotImageLinks({...spotImageLinks,
                    '1': {
                    url: e.target.value,
                    preview: false,
                    id: '1'
                }})}
                />
                <div className='errors'>{errors[`image1`]}</div>
                <input
                type="text"
                value={spotImageLinks['2']?.url || ''}
                onChange={(e) => setSpotImageLinks({...spotImageLinks,
                    '2': {
                    url: e.target.value,
                    preview: false,
                    id: '2'
                }})}
                />
                <div className='errors'>{errors[`image2`]}</div>
                <input
                type="text"
                value={spotImageLinks['3']?.url || ''}
                onChange={(e) => setSpotImageLinks({...spotImageLinks,
                    '3': {
                    url: e.target.value,
                    preview: false,
                    id: '3'
                }})}
                />
                <div className='errors'>{errors[`image3`]}</div>
                <input
                type="text"
                value={spotImageLinks['4']?.url || ''}
                onChange={(e) => setSpotImageLinks({...spotImageLinks,
                    '4': {
                    url: e.target.value,
                    preview: false,
                    id: '4'
                }})}
                />
                <div className='errors'>{errors[`image4`]}</div>
            </label>
            <button type="submit">{formType}</button>
        </form> 
    )
}