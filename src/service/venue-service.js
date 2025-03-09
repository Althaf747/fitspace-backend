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
    const data = validate(updateValidation,req.body);
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: id,
        }
    })
    console.log(req.user.id)
    console.log(venue.ownerId);
    if (!venue) {
        throw new ResponseError(403, "venue not found.");
    }

    if(req.user.id !== venue.ownerId) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    return prismaClient.venue.update({
        where: {
            id: id,
        },data : data
    })
}

const deleteVenue = async (id,req) => {
    const venue = await prismaClient.venue.findUnique({
        where: {
            id: id,
        }
    })

    if (!venue) {
        throw new ResponseError(403, "venue not found.");
    }

    if(req.user.id !== venue.ownerId) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    return prismaClient.venue.delete({
        where: {
            id: id,
        }
    })

}

const getAllVenue = async (req) => {
    const venues = await prismaClient.venue.findMany()
    if (!venues) {
        throw new ResponseError(403, "venue not found.");
    }
    return venues;
}


export default { create ,get , update, deleteVenue, getAllVenue };