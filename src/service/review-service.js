import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/review-validation.js";

const create = async (field_id, req) => {
    const user = req.user;
    const data = validate(createValidation,req.body);
    const field = await prismaClient.field.findUnique({
        where: {
            id : field_id,
        }
    })
    if (!field) {
        throw new ResponseError(404, "Field Not Found");
    }

    return prismaClient.review.create({
        data: {
            field_id : field_id,
            user_id : user.id,
            comment : data.comment,
            rating : data.rating,
        },select: {
            id: true,
            field_id : true,
            rating : true,
            comment : true,
        }
    })
}

const getReviewsByfield_id = async (field_id) => {
    const reviews = await prismaClient.review.findMany({
        where: { field_id },
        select: {
            id: true,
            user_id: true,
            rating: true,
            comment: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
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
            user_id: true,
            rating: true,
            comment: true,
            user: {
                select: {
                    first_name: true,
                    last_name: true,
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
        user_id: review.user_id,
        user: review.user
    }));
}

const update = async (review_id ,req) => {
    const user = req.user
    const data = validate(updateValidation,req.body);

    const review = await prismaClient.review.findUnique({
        where: {
            id: review_id,
        }
    })

    if (!review) {
        throw new ResponseError(404, "review not found.");
    }

    if(user.id !== review.user_id) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    return prismaClient.review.update({
        where: {
            id: review_id,
        }, data : data,
        select: {
            id: true,
            user_id: true,
            rating: true,
            comment: true,
        }
    })


}

const deleteReview = async (review_id ,req) => {
    const user = req.user

    const review = await prismaClient.review.findUnique({
        where: {
            id: review_id,
        }
    })

    if (!review) {
        throw new ResponseError(404, "review not found.");
    }

    if(user.id !== review.user_id) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    await prismaClient.review.delete({
        where: {
            id: review_id,
        }
    })

}

export default { create, getReviewsByfield_id, getAllReviews, update, deleteReview };