import PostReviewModal from '../PostReviewModal'

export default function CreateReviewForm({spotId}) {
    const review = {
        review: '',
        stars: ''
    }

    return (
        <PostReviewModal
        userReview={review}
        spotId={spotId}
        formType="Create Review"
        />
    )
}