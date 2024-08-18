import { Router } from "express";

import { signUp } from "../controllers/user.controller";

const router = Router();

//Open Routes
router.route('/signup').post(signUp);

export default router;