import {google} from 'googleapis';
import {prismaClient} from '../application/database.js';
import {OAuth2Client} from 'google-auth-library';
import userService from "./user-service.js";
import jwt from "jsonwebtoken";
import {logger} from "../application/logging.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const client = new OAuth2Client();

const generateAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    });
};

const getTokens = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
};

const getUserProfile = async () => {
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();
    return profile;
};

const findOrCreateUser = async (token, email,name) => {
    let user = await prismaClient.user.findUnique({
        where: { email },
    });

    let firstName = '';
    let lastName = '';
    const split = name.split(' ');
    if (split.length > 1) {
        firstName = split[0];
        lastName = name.substring(split[0].length+1, name.length);
    } else {
        firstName = name;
    }

    const req = {
        "email": email,
        "password": token.substring(0,100),
        "confirm_password": token.substring(0,100),
        "first_name": firstName,
        "last_name": lastName,
    }

    if (!user) {
        const user = userService.register(req);
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        return {
            "user": user,
            "token": token,
        }
    } else {
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        return {
            "user": user,
            "token": token,
        }
    }
};

const verify = async (token, client_id) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
    });
    return ticket.getPayload();
}

export default {
    generateAuthUrl,
    getTokens,
    getUserProfile,
    findOrCreateUser,
    verify
};
