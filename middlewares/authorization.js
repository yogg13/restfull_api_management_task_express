const { Project, Task } = require("../models");

const authorizeProject = async (req, res, next) => {
	try {
		const { id } = req.params;
		const project = await Project.findByPk(id);

		if (!project) {
			throw { name: "NotFound", message: "Project not found" };
		}

		if (project.userId !== req.user.id) {
			throw {
				name: "Forbidden",
				message: "You are not authorized to access this project",
			};
		}

		req.project = project;
		next();
	} catch (error) {
		next(error);
	}
};

const authorizeTask = async (req, res, next) => {
	try {
		const { projectId } = req.params;
		const project = await Project.findByPk(projectId);

		if (!project) {
			throw { name: "NotFound", message: "Project not found" };
		}

		if (project.userId !== req.user.id) {
			throw {
				name: "Forbidden",
				message: "You are not authorized to access this project",
			};
		}

		req.project = project;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { authorizeProject, authorizeTask };
