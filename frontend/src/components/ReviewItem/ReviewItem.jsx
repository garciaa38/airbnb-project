export default function ReviewItem({reviewItem}) {
    console.log("REVIEW ITEM", reviewItem)


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
    console.log('USER INFO', reviewItem.User)

    const { User, createdAt, review} = reviewItem;
    const { firstName } = User;

    const date = createdAt.split(' ')[0].split('-');
    const year = date[0];
    const month = months[date[1] - 1];
    const reviewDate = month + ' ' + year;

    console.log('REVIEW DATE', reviewDate)

    return (
        <div>
            <h2>{firstName}</h2>
            <h2>{reviewDate}</h2>
            <h2>{review}</h2>
        </div>
    )
}