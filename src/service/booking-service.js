import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/booking-validation.js";

const create = async (req, venue_id) => {
    const user = req.user;
    const data = validate(createValidation,req.body)
    console.log(data);

    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venue_id,
        }
    })

    if (!venue) {
        throw new ResponseError(404,"venue not found");
    }

    const field = await prismaClient.field.findFirst({
        where: {
            venue_id: venue_id,
            type : data.type,
        }
    })

    if (!field) {
        throw new ResponseError(404, 'field not found');
    }

    const schedule = await prismaClient.schedule.findFirst({
        where: {
            date : data.date,
            timeSlot : data.timeSlot,
        }
    })

    if (!schedule) {
        throw new ResponseError(404, 'schedule not found');
    }

    const fs = await prismaClient.fieldSchedule.findFirst({
        where: {
            field : field,
            schedule : schedule
        }
    })

    if (!fs) {
        throw new ResponseError(404, "field Schedule not found");
    }

    if (fs.status === "not available") {
        throw new ResponseError(404, "fs not available");
    }

    await prismaClient.fieldSchedule.update({
        where: {
            id : fs.id
        },data : {
            status: "not available",
        }
    })

    return prismaClient.booking.create({
        data : {
            status: "on going",
            customer_id : user.id,
            schedule_id : fs.schedule_id,
            field_id : fs.field_id
        },select : {
            id : true,
            status: true,
            customer_id : true,
            schedule : {
                select :{
                    date : true,
                    timeSlot : true,
                }
            },
            field_id : true,
        }
    })

}

const getAll = async (req)  => {
    const user = req.user;
    const bookings = await prismaClient.booking.findMany({
        where: {
            customer_id : user.id
        }, select: {
            id : true,
            status : true,
            customer : {
                select : {
                    first_name : true,
                    last_name : true,
                }
            },
            field : {
                select : {
                    id: true,
                    type : true,
                }
            },
            schedule :{
                select : {
                    id : true,
                    date : true,
                    timeSlot : true,
                }
            }
        }
    })

    if (!bookings) {
        throw new ResponseError(404, "booking not found");
    }
    return bookings;
}

const update = async (req, bookingId) => {
    const status = validate(updateValidation,req.body.status);
    const booking = await prismaClient.booking.findUnique({
        where: {
            id: bookingId,
        }
    })

    if (!booking) {
        throw new ResponseError(404, "booking not found");
    }

    if(user.id !== review.user_id) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    await prismaClient.booking.update({
        where: {
            id: bookingId,
        },data :{
            status : status,
        }
    })

    const fs = await prismaClient.fieldSchedule.findFirst({
        where: {
            field_id : booking.field_id,
            schedule_id : booking.schedule_id
        }
    })

    console.log(fs)

    if (status === "cancelled" || status === "finished") {
        await prismaClient.fieldSchedule.update({
            where: {
                id : fs.id
            },data : {
                status : "Available",
            }
        })

}}

const deleteBooking = async (req, bookingId) => {
    const user = req.user;

    const booking = await prismaClient.booking.findUnique({
        where: {
            id: bookingId,
        }
    })

    if (!booking) {
        throw new ResponseError(404, "booking not found");
    }

    if(user.id !== review.user_id) {
        if ( req.user.role !== "admin" ) {
            throw new ResponseError(403, "access denied for this user.");
        }
    }

    const fs = await prismaClient.fieldSchedule.findFirst({
        where: {
            field_id : booking.field_id,
            schedule_id : booking.schedule_id
        }
    })

    await prismaClient.fieldSchedule.update({
        where: {
            id : fs.id
        },data : {
            status : "Available",
        }
    })

    await prismaClient.booking.delete({
        where: {
            id: bookingId,
        }
    })
}

export default {create, getAll, update, deleteBooking};