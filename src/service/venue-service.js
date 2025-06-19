import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/venue-validation.js";
import {logger} from "../application/logging.js";

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
        },
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
                    id : true,
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
                    gallery : true,
                }
            }
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

    await prismaClient.field.deleteMany({
        where: {
            venue_id: id,
        },
    });

    await prismaClient.booking.deleteMany({
        where: {
            field: {
                venue_id: id,
            }
        }
    });

    await prismaClient.fieldSchedule.deleteMany({
        where: {
            field: {
                venue_id: id,
            }
        }
    });

    // Now delete the venue
    return prismaClient.venue.delete({
        where: {
            id: id,
        }
    });

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
                    id : true,
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
                    gallery : true,
                }
            }
        }
    })
    if (!venues) {
        throw new ResponseError(403, "venue not found.");
    }
    return venues;
}

const getAllVenuesByOwner = async (id) => {
    const venues = await prismaClient.venue.findMany({
        where: {
            owner_id: id,
        },
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
                    id : true,
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
                    gallery : true,
                    field_schedules: {
                        select: {
                            id: true,
                            status: true,
                            schedule: {
                                select: {
                                    time_slot: true,
                                    date: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    if (!venues) {
        throw new ResponseError(403, "venue not found.");
    }
    return venues;
}

const getVenuesAI = async (req) => {
    return prismaClient.venue.findMany({
        include: {
            fields: {
                include: {
                    field_schedules: true,
                    gallery: true,
                    bookings: true // Include bookings related to fields
                }
            },
        }
    });

}


export default { create ,get , update, deleteVenue, getAllVenue, getAllVenuesByOwner, getVenuesAI };