import fieldService from "../service/field-service.js";

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
        const { venue_id, fieldId } = req.params;
        const result = await fieldService.updateField(req, req.files, Number(venue_id), Number(fieldId));
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteField = async (req, res, next) => {
    try {
        const fieldId = parseInt(req.params.fieldId);
        const venue_id = parseInt(req.params.venue_id);
        await fieldService.deleteField(fieldId,venue_id,req);
        res.status(200).json({
            message: 'field deleted'
        })
    }catch (error) {
        next(error);
    }
}


export default { create, get, getAll, updateField, deleteField };
