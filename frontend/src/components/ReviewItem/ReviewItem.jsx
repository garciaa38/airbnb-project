import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteReviewModal from "../DeleteReviewModal/index";

export default function ReviewItem({reviewItem, userId}) {


    const months = [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'
    ];

    if (!reviewItem.User) {
        return(
            <></>
        )
    }

    const { User, createdAt, review} = reviewItem;
    const { firstName } = User;

    const date = createdAt.split(' ')[0].split('-');
    const year = date[0];
    const month = months[date[1] - 1];
    const reviewDate = month + ' ' + year;


    return (
        <div>
            <h2>{firstName}</h2>
            <h2>{reviewDate}</h2>
            <h2>{review}</h2>
            {userId === reviewItem.User.id && <OpenModalMenuItem itemText="Delete" modalComponent={<DeleteReviewModal reviewId={reviewItem.id}/>}/>}
        </div>
    )
}