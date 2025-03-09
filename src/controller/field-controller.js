import fieldService from "../service/field-service.js";

const create = async (req, res, next) => {
    try {
        const venueId = parseInt(req.params.venueId);
        const result = await fieldService.create(venueId, req.files,req);
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
        const venueId = parseInt(req.params.venueId);
        const result = await fieldService.getAll(venueId);
        res.status(200).json({
            data: result
        })
    }catch (error) {
        next(error);
    }
}

const updateField = async (req, res, next) => {
    try {
        const { venueId, fieldId } = req.params;
        const result = await fieldService.updateField(req, req.files, Number(venueId), Number(fieldId));
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
        const venueId = parseInt(req.params.venueId);
        await fieldService.deleteField(fieldId,venueId,req);
        res.status(200).json({
            message: 'field deleted'
        })
    }catch (error) {
        next(error);
    }
}


export default { create, get, getAll, updateField, deleteField };
