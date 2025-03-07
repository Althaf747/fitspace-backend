import venueService from "../service/venue-service.js";

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
        const result = await venueService.update(id,req.body);
        res.status(200).json({
            data: result,
        })
    }catch (e) {
        next(e);
    }
}

export default {createVenue,get, update}