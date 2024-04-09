export default function SpotsIndexItem({spot}) {
    const {previewImage, name, city, state, avgRating, price} = spot;
    return (
        // <h1>Spot Details here</h1>
        <div>
            <img 
            src={previewImage}
            alt={`${name}'s Preview Image`}
            />
            <h3>{city}</h3>
            <h3>{state}</h3>
            <h3>{avgRating}</h3>
            <h3>{price}</h3>
        </div>
    )
}