import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';

export default function DeleteSpotModal({spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteSpot(spotId)).then(closeModal)

    }

    return (
        <>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to remove this spot from the listings?</h3>
        <form onSubmit={handleSubmit}>
            <button type="submit">{`Yes (Delete Spot)`}</button>
            <button onClick={closeModal}>{`No (Keep Spot)`}</button>
        </form>
        </>
    )
}