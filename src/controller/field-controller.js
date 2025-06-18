import fieldService from "../service/field-service.js";
import {logger} from "../application/logging.js";

const create = async (req, res, next) => {
    try {
        const venue_id = parseInt(req.params.venue_id);
        const result = await fieldService.create(venue_id, req.files,req);
        res.status(202).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const get = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await fieldService.get(id);
        res.status(200).json({
            data: result
        })
    }catch (error) {
        next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const venue_id = parseInt(req.params.venue_id);
        const result = await fieldService.getAll(venue_id);
        res.status(200).json({
            data: result
        })
    }catch (error) {
        next(error);
    }
}

const updateField = async (req, res, next) => {
    try {
        const { venue_id, field_id } = req.params;
        const result = await fieldService.updateField(req, req.files, Number(venue_id), Number(field_id));
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteField = async (req, res, next) => {
    try {
        const field_id = parseInt(req.params.field_id);
        const venue_id = parseInt(req.params.venue_id);
        logger.info("HEREEEE");

        await fieldService.deleteField(field_id,venue_id,req);
        res.status(200).json({
            message: 'field deleted'
        })
    }catch (error) {
        next(error);
    }
}


export default { create, get, getAll, updateField, deleteField };
