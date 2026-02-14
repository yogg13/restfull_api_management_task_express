"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Tasks", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			status: {
				type: Sequelize.ENUM("todo", "in_progress", "done"),
				allowNull: false,
				defaultValue: "todo",
			},
			priority: {
				type: Sequelize.ENUM("low", "medium", "high"),
				allowNull: false,
				defaultValue: "medium",
			},
			dueDate: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			projectId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Projects",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
			},
			assignedTo: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "Users",
					key: "id",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Tasks");
	},
};
