import authService from '../service/google-service.js';
import { logger } from '../application/logging.js';
import { ResponseError } from '../error/response-error.js';
import googleService from "../service/google-service.js";

const googleLogin = async (req, res, next) => {
    try {
        const reqBody = req.body;
        logger.info(reqBody);
        const accessToken = reqBody["access_token"];
        const idToken = reqBody["id_token"];
        const clientId = reqBody["client_id"];
        const payload = await googleService.verify(idToken, clientId);

        logger.info(payload);

        const email = payload["email"];
        const name = payload["name"];
        const result = await authService.findOrCreateUser(accessToken, email, name);

        res.status(200).json({
            data: result,
            message: 'Authentication successful',
        });
    } catch (e) {
        next(new ResponseError(400, 'Google login error'));
    }
};


export default {
    googleLogin
};
