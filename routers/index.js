const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const ProjectController = require("../controllers/ProjectController");
const TaskController = require("../controllers/TaskController");

const authentication = require("../middlewares/authentication");
const {
	authorizeProject,
	authorizeTask,
} = require("../middlewares/authorization");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authentication);
// --- Projects ---
router.get("/projects", ProjectController.getAll);
router.post("/projects", ProjectController.create);
router.get("/projects/:id", authorizeProject, ProjectController.getById);
router.put("/projects/:id", authorizeProject, ProjectController.update);
router.delete("/projects/:id", authorizeProject, ProjectController.delete);

// --- Tasks (nested under projects) ---
router.get("/projects/:projectId/tasks", authorizeTask, TaskController.getAll);
router.post("/projects/:projectId/tasks", authorizeTask, TaskController.create);
router.get(
	"/projects/:projectId/tasks/:id",
	authorizeTask,
	TaskController.getById,
);
router.put(
	"/projects/:projectId/tasks/:id",
	authorizeTask,
	TaskController.update,
);
router.delete(
	"/projects/:projectId/tasks/:id",
	authorizeTask,
	TaskController.delete,
);

module.exports = router;
