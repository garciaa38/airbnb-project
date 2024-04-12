import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';

export default function DeleteReviewModal({reviewId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteReview(reviewId)).then(closeModal)
    }

    return (
        <>
         <h1>Confirm Delete</h1>
         <h3>Are you sure you want to delete this review?</h3>
         <form onSubmit={handleSubmit}>
            <button type="submit">{`Yes (Delete Review)`}</button>
            <button onClick={closeModal}>{`No (Keep Review)`}</button>
         </form>
        </>
    )
}