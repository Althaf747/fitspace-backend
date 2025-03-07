import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/venue-validation.js";

const create = async (user, req) => {
    const venue = validate(createValidation,req);
    return prismaClient.venue.create({
        data: {
            name: venue.name,
            phoneNumber: venue.phoneNumber,
            street: venue.street,
            district: venue.district,
            cityOrRegency: venue.cityOrRegency,
            province: venue.province,
            postalCode: venue.postalCode,
            latitude: venue.latitude,
            longitude: venue.longitude,
            ownerId: user.id,
        }
    })
}

const get = async (id) => {
    const venue = prismaClient.venue.findUnique({
        where: {
            id: id,
        }
    })
    if (!venue) {
        throw new ResponseError(403, "venue not found.");
    }

    return venue;
}

const update = async (id,req) => {
    const data = validate(updateValidation,req);
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: id,
        }
    })
    if (!venue) {
        throw new ResponseError(403, "venue not found.");
    }

    return prismaClient.venue.update({
        where: {
            id: id,
        },data : data
    })
}

export default { create ,get , update}