import { Router } from "express";

import { signUp, login, logout } from "../controllers/user.controller.js";
import checkAuth from "../middlewares/auth.middleware.js" 

const router = Router();

//Open Routes
router.route('/signup').post(signUp);
router.route('/login').post(login);

//Authorized Routes
router.route('/logout').get(checkAuth, logout);

export default router;