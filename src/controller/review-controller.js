import reviewService from "../service/review-service.js";

const create = async (req, res, next) => {
    try {
        const field_id = parseInt(req.params.field_id);
        const result = await reviewService.create(field_id,req);
        res.status(200).json({
            data: result,
        });
    }catch (e) {
        next(e);
    }
}

const getReviewsByfield_id = async (req, res, next) => {
    try {
        const field_id = parseInt(req.params.field_id);
        const result = await reviewService.getReviewsByfield_id(field_id);
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

const getAllReviews = async (req, res, next) => {
    try {
        const result = await reviewService.getAllReviews();
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        const result = await reviewService.update(reviewId, req);
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const reviewId = parseInt(req.params.reviewId);
        await reviewService.deleteReview(reviewId,req);
        res.status(200).json({
            message: 'Review deleted successfully.',
        })
    }catch (e) {
        next(e);
    }
}

export default {create, getReviewsByfield_id, getAllReviews, update, deleteReview};