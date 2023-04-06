import express from 'express'
import userController from '../controllers/userController.js';
import {validate} from '../middleware/authenticationMiddlewawre.js';

const userRouter = express.Router();

userRouter.route('/login').post(userController.login);

userRouter.route('/register').post(userController.register);

userRouter.route('/').get(validate,userController.home);

userRouter.route('/sendemailvarification').get(validate,userController.sendEmailOtp);

userRouter.route('/update').post(validate,userController.updateProfile);

userRouter.route('/reset').post(userController.restPasswordLink);

userRouter.route('/reset/:id/:token').post(userController.restPassword);

userRouter.route('/varifyemail').post(validate,userController.varifyEmail);

export default userRouter;