const { Project, Task, User } = require("../models");

class ProjectController {
	static async getAll(req, res, next) {
		try {
			const projects = await Project.findAll({
				where: { userId: req.user.id },
				include: [
					{
						model: User,
						as: "owner",
						attributes: ["username", "email"],
					},
				],
				order: [["createdAt", "DESC"]],
			});

			res.status(200).json({
				message: "Projects retrieved successfully",
				data: projects,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const project = await Project.findOne({
				where: {
					id: req.params.id,
					userId: req.user.id,
				},
				include: [
					{
						model: User,
						as: "owner",
						attributes: ["username", "email"],
					},
					{
						model: Task,
						as: "tasks",
						include: [
							{
								model: User,
								as: "assignee",
								attributes: ["username", "email"],
							},
						],
					},
				],
			});

			if (!project) {
				throw { name: "NotFound", message: "Project not found" };
			}

			res.status(200).json({
				message: "Project retrieved successfully",
				data: project,
			});
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const { name, description, status } = req.body;

			const project = await Project.create({
				name,
				description,
				status,
				userId: req.user.id,
			});

			res.status(201).json({
				message: "Project created successfully",
				data: project,
			});
		} catch (error) {
			next(error);
		}
	}

	static async update(req, res, next) {
		try {
			const { name, description, status } = req.body;

			await req.project.update({ name, description, status });

			res.status(200).json({
				message: "Project updated successfully",
				data: req.project,
			});
		} catch (error) {
			next(error);
		}
	}

	static async delete(req, res, next) {
		try {
			await req.project.destroy();

			res.status(200).json({
				message: "Project deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = ProjectController;
