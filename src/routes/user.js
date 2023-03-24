import express from 'express'
import {check,body} from 'express-validator'
import userController from '../controllers/userController.js';
import {validate} from '../middleware/authenticationMiddlewawre.js';

const userRouter = express.Router();

userRouter.route('/login').checkout(
    [
        body('email').isEmail().withMessage('Enter a valid email address'),
        body('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long')
    ])
    .post(userController.login);

userRouter.route('/register').checkout(
    [
        check('email').isEmail().withMessage('Enter a valid email address'),
        check('username').not().isEmpty().withMessage('You username is required'),
        check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
        check('firstName').not().isEmpty().withMessage('You first name is required'),
        check('lastName').not().isEmpty().withMessage('You last name is required')
    ])
    .post(userController.register);

userRouter.route('/').get(validate,userController.home);

userRouter.route('/sendemailvarification').get(validate,userController.sendEmailOtp);

userRouter.route('/update').post(validate,userController.updateProfile);

userRouter.route('/reset').post(userController.restPasswordLink);

userRouter.route('/reset/:id/:token').post(userController.restPassword);

userRouter.route('/varifyemail').post(validate,userController.varifyEmail);

export default userRouter;