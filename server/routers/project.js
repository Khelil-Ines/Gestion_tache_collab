const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/project");
const auth=require('../middleware/auth')

router.get("/:id",ProjectController.fetchProject)

router.patch("/:id", auth.loggedMiddleware, ProjectController.updateProject)

router.post("/add",auth.loggedMiddleware, ProjectController.addProject);

router.delete("/:id", ProjectController.deleteProject);

router.post("/invite/:projectId", ProjectController.inviteUserToProject);

module.exports = router;
