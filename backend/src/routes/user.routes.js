import { Router } from "express";

import { signUp, login, logout, getMe, generateNewAccessRefreshTokens } from "../controllers/user.controller.js";
import { checkAuth } from "../middlewares/index.js" 

const router = Router();

//Open Routes
router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/refresh-token').get(generateNewAccessRefreshTokens);

//Authorized Routes
router.route('/logout').get(checkAuth, logout);
router.route('/get-me').get(checkAuth, getMe);


export default router;