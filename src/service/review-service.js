import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/review-validation.js";

const create = async (fieldId, req) => {
    const user = req.user;
    const data = validate(createValidation,req.body);
    const field = await prismaClient.field.findUnique({
        where: {
            id : fieldId,
        }
    })
    if (!field) {
        throw new ResponseError(404, "Field Not Found");
    }

    return prismaClient.review.create({
        data: {
            fieldId : fieldId,
            userId : user.id,
            comment : data.comment,
            rating : data.rating,
        },select: {
            id: true,
            fieldId : true,
            rating : true,
            comment : true,
        }
    })
}

const getReviewsByFieldId = async (fieldId) => {
    const reviews = await prismaClient.review.findMany({
        where: { fieldId },
        select: {
            id: true,
            userId: true,
            rating: true,
            comment: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }
    });

    if (reviews.length === 0) {
        throw new ResponseError(404, "No reviews found for this field");
    }

    return reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        user: review.user
    }));
};

const getAllReviews = async (req) => {
    const reviews = await prismaClient.review.findMany({
        select: {
            id: true,
            userId: true,
            rating: true,
            comment: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }
    })
    if (reviews.length === 0) {
        throw new ResponseError(404, "Review Not Found");
    }
    return reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        userId: review.userId,
        user: review.user
    }));
}

const update = async (reviewId ,req) => {
    const user = req.user
    const data = validate(updateValidation,req.body);

    const review = await prismaClient.review.findUnique({
        where: {
            id: reviewId,
        }
    })

    if (!review) {
        throw new ResponseError(404, "review not found.");
    }

    if(user.id !== review.userId) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    return prismaClient.review.update({
        where: {
            id: reviewId,
        }, data : data,
        select: {
            id: true,
            userId: true,
            rating: true,
            comment: true,
        }
    })


}

const deleteReview = async (reviewId ,req) => {
    const user = req.user

    const review = await prismaClient.review.findUnique({
        where: {
            id: reviewId,
        }
    })

    if (!review) {
        throw new ResponseError(404, "review not found.");
    }

    if(user.id !== review.userId) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    await prismaClient.review.delete({
        where: {
            id: reviewId,
        }
    })

}

export default { create, getReviewsByFieldId, getAllReviews, update, deleteReview };