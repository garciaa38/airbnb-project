import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSpot } from '../../store/spots';

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
    const [SpotImages, setSpotImages] = useState(spot?.SpotImages);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        await dispatch(addSpot(spot))

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
            </label>
            <label>
                Street Address
                <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label>
                City
                <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
            </label>
            <label>
                State
                <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                />
            </label>
            <label>
                Latitude
                <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                />
            </label>
            <label>
                Longitude
                <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                />
            </label>
            <label>
                Description
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>
                Name
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Price
                <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            <button type="submit">{formType}</button>
        </form> 
    )
}