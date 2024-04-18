import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";

export default function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpot(spotId)).then(closeModal);
  };

  return (
    <div className="delete-form">
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to remove this spot from the listings?</h3>
      <form onSubmit={handleSubmit}>
        <div className="delete-spot-btn">
          <button type="submit">{`Yes (Delete Spot)`}</button>
        </div>
        <div className="keep-spot-btn">
          <button onClick={closeModal}>{`No (Keep Spot)`}</button>
        </div>
      </form>
    </div>
  );
}
