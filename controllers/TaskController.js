const { Task, User } = require("../models");

class TaskController {
	static async getAll(req, res, next) {
		try {
			const { projectId } = req.params;

			const tasks = await Task.findAll({
				where: { projectId },
				include: [
					{
						model: User,
						as: "assignee",
						attributes: ["id", "username", "email"],
					},
				],
				order: [["createdAt", "DESC"]],
			});

			res.status(200).json({
				message: "Tasks retrieved successfully",
				data: tasks,
			});
		} catch (error) {
			next(error);
		}
	}

	static async getById(req, res, next) {
		try {
			const { projectId, id } = req.params;

			const task = await Task.findOne({
				where: { id, projectId },
				include: [
					{
						model: User,
						as: "assignee",
						attributes: ["id", "username", "email"],
					},
				],
			});

			if (!task) {
				throw { name: "NotFound", message: "Task not found" };
			}

			res.status(200).json({
				message: "Task retrieved successfully",
				data: task,
			});
		} catch (error) {
			next(error);
		}
	}

	static async create(req, res, next) {
		try {
			const { projectId } = req.params;
			const { title, description, status, priority, dueDate, assignedTo } =
				req.body;

			const task = await Task.create({
				title,
				description,
				status,
				priority,
				dueDate,
				projectId,
				assignedTo,
			});

			res.status(201).json({
				message: "Task created successfully",
				data: task,
			});
		} catch (error) {
			next(error);
		}
	}

	static async update(req, res, next) {
		try {
			const { projectId, id } = req.params;
			const { title, description, status, priority, dueDate, assignedTo } =
				req.body;

			const task = await Task.findOne({
				where: { id, projectId },
			});

			if (!task) {
				throw { name: "NotFound", message: "Task not found" };
			}

			await task.update({
				title,
				description,
				status,
				priority,
				dueDate,
				assignedTo,
			});

			res.status(200).json({
				message: "Task updated successfully",
				data: task,
			});
		} catch (error) {
			next(error);
		}
	}

	static async delete(req, res, next) {
		try {
			const { projectId, id } = req.params;

			const task = await Task.findOne({
				where: { id, projectId },
			});

			if (!task) {
				throw { name: "NotFound", message: "Task not found" };
			}

			await task.destroy();

			res.status(200).json({
				message: "Task deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	}
}

module.exports = TaskController;
