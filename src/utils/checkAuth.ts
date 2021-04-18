import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secretKey";

const checkAuth = (context: any) => {
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Miskine ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Miskine [token]");
    }
    throw new Error('Authorization header must be provided');
};

export default checkAuth;