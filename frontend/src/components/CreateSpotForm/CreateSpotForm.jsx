import SpotForm from "../SpotForm"
//import { addReview } from "../../store/reviews"

export default function CreateSpotForm() {
    const spot = {
        country: '',
        address: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        description: '',
        name: '',
        price: '',
        SpotImages: []
    }

    return (
        <SpotForm
        spot={spot}
        formType="Create Spot"
        //onSubmit={addReview}
        />
    )

}