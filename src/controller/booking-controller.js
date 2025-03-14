import bookingService from "../service/booking-service.js";

const create = async (req,res,next) => {
    try {
        const venueId = parseInt(req.params.venueId);
        const result = await bookingService.create(req, venueId);
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
        const bookingId = parseInt(req.params.bookingId);
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