import express from 'express';
import { createTaskController, getTasksController, updateTaskController, deleteTaskController, toggleTaskController } from '../controllers/task.controller.js';
import { requiredAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post("/create", requiredAuth, createTaskController);
router.put("/update/:id", requiredAuth, updateTaskController);
router.delete("/delete/:id", requiredAuth, deleteTaskController);
router.patch("/toggle/:id", requiredAuth, toggleTaskController);
router.get("/me", requiredAuth, getTasksController);

export default router;