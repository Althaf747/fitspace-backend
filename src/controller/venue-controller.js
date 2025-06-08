import venueService from "../service/venue-service.js";
import {logger} from "../application/logging.js";

const createVenue = async (req, res, next) => {
    try {
        const result = await venueService.create(req.user,req.body);

        res.status(200).json({
            data: result,
        });
    }catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await venueService.get(id,req);
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await venueService.update(id,req);
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

const deleteVenue = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await venueService.deleteVenue(id,req);
        res.status(200).json({
            message: 'Venue deleted successfully.',
        })
    }catch (e) {
        next(e);
    }
}

const getAllVenues = async (req, res, next) => {
    try {
        const result = await venueService.getAllVenue();
        res.status(200).json({
            data: result,
        })
    }catch (e){
        next(e);
    }
}

const getAllVenuesByOwner = async (req, res, next) => {
    try {
        const id = parseInt(req.user.id);
        const result = await venueService.getAllVenuesByOwner(id);
        res.status(200).json({
            data: result,
        })
    }catch (e){
        next(e);
    }
}

export default {createVenue,get, update, deleteVenue, getAllVenues, getAllVenuesByOwner};