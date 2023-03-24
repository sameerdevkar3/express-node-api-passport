import jwt from 'jsonwebtoken'

export const validate = async function (req, res, next) {
    try {
        let token = req.headers.token;
        if (!token) {
            return res.status(400).json({ error: `user must be logged in` });
        }
        else {
            let data = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = data;
            next();
        }
    } catch (error) {
        next(error);
    }
}