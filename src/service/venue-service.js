import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/venue-validation.js";

const create = async (user, req) => {
    const venue = validate(createValidation,req);
    return prismaClient.venue.create({
        data: {
            name: venue.name,
            phone_number: venue.phone_number,
            street: venue.street,
            district: venue.district,
            city_or_regency: venue.city_or_regency,
            province: venue.province,
            postal_code: venue.postal_code,
            latitude: venue.latitude,
            longitude: venue.longitude,
            owner_id: user.id,
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
    console.log(venue.owner_id);
    if (!venue) {
        throw new ResponseError(403, "venue not found.");
    }

    if(req.user.id !== venue.owner_id) {
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

    if(req.user.id !== venue.owner_id) {
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

const getAllVenue = async () => {
    const venues = await prismaClient.venue.findMany({
        select: {
            id: true,
            name : true,
            phone_number: true,
            street: true,
            district: true,
            city_or_regency: true,
            province: true,
            postal_code: true,
            latitude: true,
            longitude: true,
            rating: true,
            owner : {
                select :{
                    first_name : true,
                    last_name : true,
                    created_at : true,
                }
            },
            fields : {
                select : {
                    id: true,
                    type : true,
                    price : true,
                }
            }
        }
    })
    if (!venues) {
        throw new ResponseError(403, "venue not found.");
    }
    return venues;
}


export default { create ,get , update, deleteVenue, getAllVenue };