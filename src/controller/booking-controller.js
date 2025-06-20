import bookingService from "../service/booking-service.js";
import {logger} from "../application/logging.js";

const create = async (req,res,next) => {
    try {
        const venue_id = parseInt(req.params.venue_id);
        logger.info(`TEST: ${JSON.stringify(req.body)}`);
        const result = await bookingService.create(req, venue_id);
        res.status(200).json({
            data: result,
        })
    }catch(e){
        next(e)
    }
}

const getAll = async (req,res,next) => {
    try {
        const result = await bookingService.getAll(req);
        res.status(200).json({
            data: result,
        })
    }catch(e){
        next(e)
    }
}

const update = async (req,res,next) => {
    try {
        const bookingId = parseInt(req.params.booking_id);
        await bookingService.update(req,bookingId)
        res.status(200).json({
            message: "Booking updated successfully",
        })
    }catch(e){
        next(e)
    }
}

const deleteBooking = async (req,res,next) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        await bookingService.deleteBooking(req,bookingId);
        res.status(200).json({
            message: "Booking deleted successfully",
        })
    }catch(e){
        next(e)
    }

}

export default {create, getAll, update, deleteBooking}