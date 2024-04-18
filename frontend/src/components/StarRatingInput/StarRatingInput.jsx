import { FaStar } from 'react-icons/fa';
import { useState } from 'react';
import './StarRatingInput.css'

export default function StarRatingInput({rating, disabled, onChange}) {
    const [activeRating, setActiveRating] = useState(rating);

    return (
        <>
          <div className="rating-input">
            {[1,2,3,4,5].map(rate => {
                return <FaStar 
                key={rate}
                className={activeRating >= rate ? "filled" : "empty"}
                onMouseEnter={() => {if (!disabled) setActiveRating(rate)}}
                onMouseLeave={() => setActiveRating(rating)}
                onClick={() => onChange(rate)}
                />
            })}
          </div>
        </>
    )
}