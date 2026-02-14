"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Task extends Model {
		static associate(models) {
			Task.belongsTo(models.Project, {
				foreignKey: "projectId",
				as: "project",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			Task.belongsTo(models.User, {
				foreignKey: "assignedTo",
				as: "assignee",
				onDelete: "SET NULL",
				onUpdate: "CASCADE",
			});
		}
	}

	Task.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Task title is required" },
					notEmpty: { msg: "Task title cannot be empty" },
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM("todo", "in_progress", "done"),
				allowNull: false,
				defaultValue: "todo",
				validate: {
					isIn: {
						args: [["todo", "in_progress", "done"]],
						msg: "Status must be todo, in_progress, or done",
					},
				},
			},
			priority: {
				type: DataTypes.ENUM("low", "medium", "high"),
				allowNull: false,
				defaultValue: "medium",
				validate: {
					isIn: {
						args: [["low", "medium", "high"]],
						msg: "Priority must be low, medium, or high",
					},
				},
			},
			dueDate: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			projectId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Projects",
					key: "id",
				},
			},
			assignedTo: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "Users",
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "Task",
		},
	);

	return Task;
};
