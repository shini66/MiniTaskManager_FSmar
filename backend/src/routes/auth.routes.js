import express from "express";
import { register, login, listUses } from "../controllers/auth.controller.js";
import { requiredAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', requiredAuth, listUses)

export default router;