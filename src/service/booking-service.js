import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {createValidation, updateValidation} from "../validation/booking-validation.js";

const create = async (req, venueId) => {
    const user = req.user;
    const data = validate(createValidation,req.body)
    console.log(data);

    const venue = await prismaClient.venue.findUnique({
        where: {
            id: venueId,
        }
    })

    if (!venue) {
        throw new ResponseError(404,"venue not found");
    }

    const field = await prismaClient.field.findFirst({
        where: {
            venueId: venueId,
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
            customerId : user.id,
            scheduleId : fs.scheduleId,
            fieldId : fs.fieldId
        },select : {
            id : true,
            status: true,
            customerId : true,
            schedule : {
                select :{
                    date : true,
                    timeSlot : true,
                }
            },
            fieldId : true,
        }
    })

}

const getAll = async (req)  => {
    const user = req.user;
    const bookings = await prismaClient.booking.findMany({
        where: {
            customerId : user.id
        }, select: {
            id : true,
            status : true,
            customer : {
                select : {
                    firstName : true,
                    lastName : true,
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

    await prismaClient.booking.update({
        where: {
            id: bookingId,
        },data :{
            status : status,
        }
    })

    const fs = await prismaClient.fieldSchedule.findFirst({
        where: {
            fieldId : booking.fieldId,
            scheduleId : booking.scheduleId
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

export default {create, getAll, update};