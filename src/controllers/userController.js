import userModel from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { sendMail } from '../config/emailSender.js'

class userController {
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await userModel.findOne({ email: email });
            if (result) {
                if (result.email == email && userModel(result).comparePassword(password)) {
                    const accressToken = userModel(result).generateJWT();
                    res.cookie("token",accressToken);
                    res.send({ "status": "success", "message": "successfully login", "token": accressToken });
                }
                else {
                    res.send({ "status": "failed", "message": "Incorrect credential" });
                }
            }
            else {
                res.send({ "status": "failed", "message": `Account ${email} not found` });
            }

        } catch (error) {
            res.status(500).send({ "status": "failed", "message": "server error" });
        }
    }

    static register = async (req, res) => {
        try {
            var doc = userModel(req.body);
            const result = await userModel.findOne({ email: doc.email });
            if (result) {
                return res.send({ "status": "failed", "message": `Already have account ${doc.email}` });
            }
            await doc.save();
            res.status(201).send({ "status": "success", "message": "successfully create account" });
        } catch (error) {
            res.status(500).send({ "status": "failed", "message": "server error" });
            console.log(error);
        }
    }

    static updateProfile = async (req, res) => {
        try {
            const data = {};
            for (let [key, value] of Object.entries(req.body)) {
                if (key === 'password') {
                    let hash = bcrypt.hashSync(value, 12);
                    value = hash;
                }
                data[key] = value;
            }
            await userModel.updateOne({ email: req.user.email }, data);
            res.send({ "status": "success", "message": "Successfully update" });
        }
        catch (error) {
            res.status(500).send({ "status": "failed", "message": "server error" });
        }
    }

    static home = async (req, res) => {
        try {
            const result = await userModel.findOne({ email: req.user.email });
            res.json({ email: result.email, "status": "success" });
        } catch (error) {
            res.status(500).send({ "status": "failed", "message": "server error" });
        }
    }

    static restPasswordLink = async (req, res) => {
        const { email } = req.body;
        const result = await userModel.findOne({ email: email });
        if (result) {
            let token = jwt.sign({ email: email }, result._id + process.env.JWT_SECRET, { expiresIn: '5m' });
            let link = `http://localhost:3000/user/reset/${result._id}/${token}`;
            res.send({ "status": "success", "link": link });
        }
        else {
            res.send({ "status": "failed", "message": `account not found ${email}` });
        }
    }

    static restPassword = async (req, res) => {
        const { id, token } = req.params;
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.send({ "status": "failed", "message": "dose not match confirm password" });
            return;
        }
        try {
            const result = await userModel.findById(id);
            if (result) {
                let newToken = result._id + process.env.JWT_SECRET;
                if (jwt.verify(token, newToken)) {
                    let hash = bcrypt.hashSync(password, 12);
                    await userModel.updateOne({ _id: id }, { password: hash });
                    res.send({ "status": "success", "message": "successfully changed password" });
                }
                else {
                    res.send({ "status": "failed", "message": "unauthorized user" });
                }
            }
            else {
                res.send({ "status": "failed", "message": "not found user" });
            }
        }
        catch (err) {
            res.status(500).send({ "status": "faild", "message": "server error" });
        }
    }

    static varifyEmail = async (req, res) => {
        const doc = req.user;
        const { otp } = req.body;
        const result = await userModel.findById(doc.id);
        if (result.emailOTP === otp && result.OTPExpires > Date.now()) {
            await userModel.findByIdAndUpdate(doc.id, { confirmEmail: true });
            res.send({ "status": "succuess", "message": "confirmed email" });
        }
        else {
            res.send({ "status": "failed", "message": "wrong otp" });
        }
    }

    static sendEmailOtp = async (req, res) => {
        const doc = await userModel.findOne({ _id: req.user.id });
        let remainingTime = new Date() <= new Date(doc.OTPExpires);
        if (remainingTime) {
            return res.send({"status": "failed", "message": "wait for one minute for resend"});
        }

        let OTP = Math.floor(100000 + Math.random() * 900000);
        sendMail(doc.email, OTP);
        doc["emailOTP"] = OTP;
        doc["OTPExpires"] = new Date(Date.now() + (1 * 60 * 1000));
        try {
            await userModel.findByIdAndUpdate(doc.id, { emailOTP: OTP, OTPExpires: doc.OTPExpires });
            res.send({ "status": "succuess", "message": "send otp" });
        } catch (error) {
            res.send({ "status": "failed", "message": "server error" });
        }
    }
}

export default userController;