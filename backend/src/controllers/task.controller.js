import { getTasksByUser, createTask, updateTask, deleteTask, toggleTask } from "../services/task.service.js";

async function createTaskController(req, res) {
    try {
        const userId = req.user._id;
        const { title, description } = req.body;
        const task = await createTask({ title, description, user: userId });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getTasksController(req, res) {
    try {
        const userId = req.user._id;
        const tasks = await getTasksByUser(userId, {
            search: req.query.search,
            status: req.query.status,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            order: req.query.order || 1
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

function handleTaskError(res, error) {
    const status = error.message.toLowerCase().includes('not found') ? 404 : 400;
    res.status(status).json({ message: error.message });
}

async function updateTaskController(req, res) {
    try {
        const userId = req.user._id;
        const taskId = req.params.id;
        const { title, description } = req.body;
        const task = await updateTask(taskId, userId, { title, description });
        res.status(200).json(task);
    } catch (error) {
        handleTaskError(res, error);
    }
}

async function deleteTaskController(req, res) {
    try {
        const userId = req.user._id;
        const taskId = req.params.id;
        await deleteTask(taskId, userId);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        handleTaskError(res, error);
    }
}

async function toggleTaskController(req, res) {
    try {
        const userId = req.user._id;
        const taskId = req.params.id;
        const task = await toggleTask(taskId, userId);
        res.status(200).json(task);
    } catch (error) {
        handleTaskError(res, error);
    }
}

export { createTaskController, getTasksController, updateTaskController, deleteTaskController, toggleTaskController };