"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Project extends Model {
		static associate(models) {
			Project.belongsTo(models.User, {
				foreignKey: "userId",
				as: "owner",
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			});
			Project.hasMany(models.Task, {
				foreignKey: "projectId",
				as: "tasks",
			});
		}
	}

	Project.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Project name is required" },
					notEmpty: { msg: "Project name cannot be empty" },
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			status: {
				type: DataTypes.ENUM("active", "inactive", "completed"),
				allowNull: false,
				defaultValue: "active",
				validate: {
					isIn: {
						args: [["active", "inactive", "completed"]],
						msg: "Status must be active, inactive, or completed",
					},
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
		},
		{
			sequelize,
			modelName: "Project",
		},
	);

	return Project;
};
