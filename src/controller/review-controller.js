import reviewService from "../service/review-service.js";

const create = async (req, res, next) => {
    try {
        const fieldId = parseInt(req.params.fieldId);
        const result = await reviewService.create(fieldId,req);
        res.status(200).json({
            data: result,
        });
    }catch (e) {
        next(e);
    }
}

const getReviewsByFieldId = async (req, res, next) => {
    try {
        const fieldId = parseInt(req.params.fieldId);
        const result = await reviewService.getReviewsByFieldId(fieldId);
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

export default {create, getReviewsByFieldId, getAllReviews, update, deleteReview};