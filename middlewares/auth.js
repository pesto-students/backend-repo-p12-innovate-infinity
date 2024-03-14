import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
    // get token from header
    const token = req.header("x-auth-token");

    if (!token) {
        return res
            .status(401)
            .json({ msg: "no token found, authorization denied" });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "token is not valid" });
    }
};

export default auth;