"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			User.hasMany(models.Project, {
				foreignKey: "userId",
				as: "projects",
			});
			User.hasMany(models.Task, {
				foreignKey: "assignedTo",
				as: "assignedTasks",
			});
		}
	}

	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: { msg: "Username is required" },
					notEmpty: { msg: "Username cannot be empty" },
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notNull: { msg: "Email is required" },
					notEmpty: { msg: "Email cannot be empty" },
					isEmail: { msg: "Must be a valid email address" },
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: { msg: "Password is required" },
					notEmpty: { msg: "Password cannot be empty" },
				},
			},
		},
		{
			sequelize,
			modelName: "User",
		},
	);

	return User;
};
