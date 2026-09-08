import express from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller.js";
import { requiredAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requiredAuth, logout);
router.get('/me', requiredAuth, getMe);


export default router;